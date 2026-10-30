import os
import gradio as gr
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 1. Set Groq API Key and Model
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY
GROQ_MODEL = os.getenv("GROQ_MODEL_NAME", "openai/gpt-oss-20b")

# Initialize ChatGroq LLM
llm = ChatGroq(
    model_name=GROQ_MODEL,
    groq_api_key=GROQ_API_KEY,
    temperature=0.2,
    max_retries=2
)

# Shared embedding model cached locally
print("Loading embeddings...")
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"local_files_only": True}
)
print("Embeddings loaded.")

current_retriever = None
current_filename = None

def chat_with_docs(message, history):
    global current_retriever, current_filename
    
    # Handle Gradio multimodal input structure (text + files)
    if isinstance(message, dict):
        user_message = message.get("text", "")
        files = message.get("files", [])
    else:
        user_message = str(message)
        files = []
        
    # If a file was uploaded in this message, process it immediately!
    if files:
        file_path = files[0]
        base_name = os.path.basename(file_path)
        print(f"Processing uploaded file: {base_name}")
        
        try:
            if file_path.lower().endswith(".pdf"):
                loader = PyPDFLoader(file_path)
            elif file_path.lower().endswith(".csv"):
                loader = CSVLoader(file_path)
            elif file_path.lower().endswith(".txt") or file_path.lower().endswith(".md"):
                loader = TextLoader(file_path, encoding="utf-8")
            else:
                return "❌ Unsupported file format! Please upload a PDF, TXT, MD, or CSV file."
            
            docs = loader.load()
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            splits = text_splitter.split_documents(docs)
            
            vectorstore = FAISS.from_documents(splits, embeddings)
            current_retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
            current_filename = base_name
            
            if not user_message.strip():
                return f"✅ **Document '{base_name}' successfully processed ({len(splits)} chunks)!**\nYou can now ask any question or request a summary."
        except Exception as e:
            return f"❌ Failed to process file: {str(e)}"
            
    # Format chat history for LangChain
    chat_history = []
    if history:
        for turn in history:
            if isinstance(turn, (list, tuple)) and len(turn) == 2:
                human_msg, ai_msg = turn
                if human_msg:
                    chat_history.append(("human", str(human_msg)))
                if ai_msg:
                    chat_history.append(("ai", str(ai_msg)))
                    
    # 1. If no file has been uploaded yet, act like a normal chatbot with memory
    if current_retriever is None:
        if not user_message.strip():
            return "Please type a message or upload a document."
            
        messages = chat_history + [("human", user_message)]
        prompt = ChatPromptTemplate.from_messages(messages)
        chain = prompt | llm
        try:
            response = chain.invoke({})
            return response.content
        except Exception as e:
            return f"Error communicating with LLM: {str(e)}"
            
    # 2. If a file is loaded, use history-aware RAG
    if not user_message.strip():
        user_message = f"Please summarize the document {current_filename}."
        
    rephrasing_prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        ("system", "Given the above conversation and question, generate a concise search query to look up in the vector store to find the most relevant information.")
    ])
    
    history_aware_retriever = create_history_aware_retriever(
        llm, current_retriever, rephrasing_prompt
    )
    
    system_prompt = (
        "You are an educational assistant analyzing the uploaded document.\n"
        "Follow these formatting rules:\n"
        "1. Heading: Clear descriptive title\n"
        "2. ### 🎯 Direct Answer: Direct concise answer first\n"
        "3. ### 🔍 Key Concepts / Working Steps: Step-by-step or detailed breakdown\n"
        "4. Bullet points and Markdown tables where comparison makes sense\n"
        "5. ### 💡 Conclusion: Brief summary wrap up\n\n"
        "Context retrieved from the document:\n{context}\n\n"
        "If the answer cannot be found in the context, say that you don't know based on the document."
    )
    
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    try:
        response = rag_chain.invoke({
            "input": user_message,
            "chat_history": chat_history
        })
        return response["answer"]
    except Exception as e:
        return f"Error during retrieval/generation: {str(e)}"

# --- Unified Chat Interface with File Attachments ---
demo = gr.ChatInterface(
    fn=chat_with_docs,
    title="🤖 AI Document Assistant",
    description="Chat normally or click the **paperclip / plus (+)** icon next to the textbox to upload your PDF, TXT, or CSV files directly into the conversation!",
    multimodal=True
)

if __name__ == "__main__":
    port = int(os.getenv("GRADIO_SERVER_PORT", "7860"))
    print(f"Launching Gradio on port {port}...")
    demo.launch(
        server_name="127.0.0.1",
        server_port=port,
        inline=False,
        share=False,
        theme=gr.themes.Soft()
    )
