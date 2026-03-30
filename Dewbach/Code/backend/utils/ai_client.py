import os
import requests
from dotenv import load_dotenv
load_dotenv()

def get_priority_suggestion(tasks):
    task_list = '\n'.join(
        f"{i+1}. \"{t['title']}\" — due: {t.get('dueDate', 'none')}, "
        f"time: {t.get('dueTime', 'none')}, "
        f"priority: {t.get('priority', 'none')}, "
        f"status: {t.get('status', 'none')}, "
        f"done: {t.get('done', False)}"
        for i, t in enumerate(tasks)
    )

    prompt = f"""You are an expert productivity assistant. Given the following tasks, analyze each one carefully and suggest an optimal priority order.
For each task, provide a detailed reason that considers the due date, priority level, status, and potential consequences of not completing it on time.
Respond only in JSON like this: {{"priorities": [{{"title": "task name", "reason": "detailed reasoning here"}}]}}

Tasks:
{task_list}"""
    
    print('Sending request with key:', os.getenv('OPENROUTER_API_KEY')[:8])

    response = requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            'Content-Type': 'application/json'
        },
        json={
            'model': 'openai/gpt-oss-120b:free',
            'messages': [{'role': 'user', 'content': prompt}]
        }
    )

    data = response.json()
    if 'choices' not in data:
        return {'error': str(data)}
    return data['choices'][0]['message']['content']