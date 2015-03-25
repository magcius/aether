
import csv
import json
import sys

articles = []
with open(sys.argv[1], 'rb') as f:
    for title, url in csv.reader(f):
        article = dict(title=title, url=url)
        articles.append(article)
print json.dumps(articles, indent=2)

