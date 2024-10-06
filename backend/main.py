import os
from fastapi import FastAPI
# import autogen
import logging
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from mongoConnect import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(router)

origins = [
    "http://localhost:3000",  # If React is running on localhost:3000
    "http://127.0.0.1:3000",  # Alternate localhost form
    # You can add more URLs here if needed, like production URLs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows specified origins
    allow_credentials=True,           # Allow cookies and authentication headers
    allow_methods=["*"],              # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],              # Allows all headers
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
os.environ["OPENAI_API_KEY"] = "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"

default_name_list = ["Critical Analyst", "The Problem-Solving Specialist", "The Creative Writer"]
default_system_prompt = [
    "You are a critical analyst with expertise in breaking down complex ideas. When given a topic, your role is to dissect arguments, present pros and cons, and offer a balanced perspective. Stay logical, precise, and thorough in your evaluations.",
    "You are an expert in problem-solving. Your goal is to help users find effective solutions to challenges they present. Focus on identifying key issues, providing clear steps, and considering practical constraints to offer actionable advice.",
    "You are a creative writer specializing in storytelling. Your task is to generate imaginative narratives or metaphors based on any topic or question presented. Use vivid descriptions, evoke emotions, and bring ideas to life with creativity."
    ]

config_list = [{
    "model": "gpt-4",
    "api_key": os.environ["OPENAI_API_KEY"]
}]

llm_config_openai = {
    "config_list": config_list,
    "temperature": 0
}

input = {
            "agents":[
                        {
                          "name": "Coder",
                          "system_prompt": "You are a coder."
                        },
                        {
                          "name": "Product_manager",
                          "system_prompt": "Creative in software product ideas."
                        },
                        {
                          "name": "security",
                          "system_prompt": "You act as a proxy for the user, forwarding their requests to the system and managing responses."
                        }
                    ]
        }

def create_assistant_agent(name=default_name_list[1], system_message=default_system_prompt[1]):
    assistant = AssistantAgent(
        name=name,
        llm_config=llm_config_openai,
        system_message=system_message
    )
    return assistant


# Function to create a UserProxyAgent
def create_user_proxy_agent(name=default_name_list[2], system_message=default_system_prompt[2]):
    system_message += """Reply TERMINATE if the task has been solved at full satisfaction.
Otherwise, reply CONTINUE, or the reason why the task is not solved yet."""
    user_proxy = UserProxyAgent(
        name=name,
        human_input_mode="NEVER",
        is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
        code_execution_config={"work_dir": "web", "use_docker": False},
        llm_config=llm_config_openai,
        system_message=system_message
    )
    return user_proxy


# Define a POST endpoint to receive the agent definitions
@app.post("/agents/")
async def receive_agents(agents_request: dict):
    
    agents = agents_request["agents"]
    
    task = agents_request["prompt"]

    created_agents = []
    
    user_proxy = ""

    for agent in agents:
        if agent["name"].lower() == "security":
            # Create an assistant agent
            user_proxy = create_user_proxy_agent(name=agent["name"],
                                                    system_message=agent["system_prompt"])
            # print(agent["name"])
            # print(agent["system_prompt"])
            # created_agents.append(user_proxy)
        elif agent["name"].lower() != "security":
            # Create a user proxy agent
            created_agent = create_assistant_agent(name=agent["name"],
                                                    system_message=agent["system_prompt"])
            # print(agent["name"])
            # print(agent["system_prompt"])
            created_agents.append(created_agent)
        else:
            return {"error": "Unknown agent type"}
    
    # logger.info("Created agents: %s", created_agents)

    # return {"message": "Agents created successfully", "agents": "created_agents", "user_proxy": "user_proxy"}
    # return {"message": "Agents created successfully", "agents": agents}
    groupchat = GroupChat(
        agents=created_agents,
        messages=[],
        max_round=20,
        speaker_selection_method='round_robin'
    )
    
    manager = GroupChatManager(groupchat=groupchat, llm_config=llm_config_openai)

    result = user_proxy.initiate_chat(
        manager,
        message=task
    )
    result_text = groupchat.messages
    # chat_history_list = str(result_text)
    chat_history_list = result_text
    # chat_history_list = [{'content': '\nTell me about the meaning of life\n', 'role': 'user', 'name': 'security'}, {'content': "I'm here to assist with coding-related questions. If you have any coding tasks or questions, feel free to ask!", 'role': 'user', 'name': 'Coder'}, {'content': 'How about a software product that helps users track and manage their digital footprint and online security? It could provide insights into what personal information is available online, offer suggestions for improving privacy settings, and alert users to potential security risks. Users could also receive tips on how to enhance their online security practices. What do you think?', 'role': 'user', 'name': 'Product_manager'}, {'content': "That sounds like a valuable and relevant software product idea! It addresses a growing concern for many users about their online privacy and security. Implementing features like tracking personal information online, providing privacy setting suggestions, and offering security risk alerts can be very beneficial. Additionally, providing tips to enhance online security practices can help users better protect themselves. It's important to consider user-friendly interfaces and clear communication of the benefits to attract and retain users. If you need help with the technical aspects or development of this product, feel free to ask!", 'role': 'user', 'name': 'Coder'}, {'content': "Great to hear that you find the software product idea valuable! If you have any specific technical questions or need assistance with the development of this product, feel free to ask. I'm here to help with any coding-related tasks or challenges you may encounter along the way.", 'role': 'user', 'name': 'Product_manager'}, {'content': 'TERMINATE', 'role': 'user', 'name': 'Coder'}]

    names = []
    for item in chat_history_list:
        names.append(item['name'])

    json_data = {}
    round = 1
    name_have_seen = []
    json_data[f"round-{round}"] = {}
    # begin with "round" + round to combine to a string
    for i in range(len(chat_history_list)):
        if not chat_history_list[i]['name'] in name_have_seen:
            name_have_seen.append(chat_history_list[i]['name'])
            json_data[f"round-{round}"][chat_history_list[i]['name']] = chat_history_list[i]['content']
        else:
            name_have_seen = []
            round += 1
            json_data[f"round-{round}"] = {}
    
    return {"conversation_summary": json_data}
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)