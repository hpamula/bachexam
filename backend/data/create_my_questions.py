import json

with open('my_subjects.json', 'r', encoding='utf-8') as f:
  my_subjects = json.load(f)
with open('official_questions.json', 'r', encoding='utf-8') as f:
  official_questions = json.load(f)
filtered_questions = {
  subject: questions
  for subject, questions in official_questions.items()
  if subject in my_subjects
}
with open('my_questions.json', 'w', encoding='utf-8') as f:
  json.dump(filtered_questions, f, ensure_ascii=False, indent=2)
print("my_questions.json created")
