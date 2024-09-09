# type: ignore
# flake8: noqa
# | label: tbl-table-of-contents
# | echo: false

# TODO: better to parse _quarto.yml file since it includes glossary, order, etc.

from pathlib import Path
from re import match

from IPython.display import Markdown
from tabulate import tabulate


def is_chapter(file):
    # Chapters start with \d\d or A\d
    return match(r"\d\d-.+\.qmd", file.name)


files = sorted([file for file in Path(".").glob("*.qmd") if is_chapter(file)])

table = []
for i, filename in enumerate(files):
    if i > 4:
        break
    with open(filename, "r") as file:
        head = [next(file) for _ in range(10)]
    title = [line.split('"') for line in head if line.startswith("title")][0][1]
    table.append([i + 1, f"[{title}]({filename})"])

Markdown(tabulate(table, headers=["Chapter", "Title"]))


