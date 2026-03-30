def build_priority_prompt(tasks):
    task_list = "\n".join(
        f"{i+1}. \"{t['title']}\" — due: {t.get('dueDate', 'none')}, effort: {t.get('effort', 'unknown')}"
        for i, t in enumerate(tasks)
    )
    return f"""..."""