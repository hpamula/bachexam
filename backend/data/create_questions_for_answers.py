import json

with open('my_questions.json', 'r', encoding='utf-8') as f:
  my_questions = json.load(f)
answered = {
  subject: {
    question: "" for number, question in questions.items()
  }
  for subject, questions in my_questions.items()
}
with open('my_answered.json', 'w', encoding='utf-8') as f:
  json.dump(answered, f, ensure_ascii=False, indent=2)
print("my_answered.json created")
