import re

input_path = r"c:\Users\JosephClark\lumn\citations_renamed.cleaned.md"
output_path = r"c:\Users\JosephClark\lumn\citations_renamed.cleaned2.md"

with open(input_path, "r", encoding="utf-8") as f:
    content = f.read()

# This regex matches code blocks that start with ``` and contain the REVIEW REQUIRED comment
pattern = re.compile(
    r"```[\s\S]*?\[REVIEW REQUIRED\][\s\S]*?```", re.MULTILINE
)

cleaned = pattern.sub("", content)

with open(output_path, "w", encoding="utf-8") as f:
    f.write(cleaned)

print(f"Cleaned file written to {output_path}")