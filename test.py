#!coding: utf-8

import sys
from bs4 import BeautifulSoup 


if len(sys.argv) < 3:
    print "usage: %prog file.html prefix";


fp = open(sys.argv[1]);
prefix = sys.argv[2];



html = fp.read();

soup = BeautifulSoup(html, features="html.parser");


for i in soup.select('div#cnblogs_post_body  div.cnblogs_code pre'):
    span1 = soup.new_tag("span");
    span2 = soup.new_tag("span");

    span1.string = "```\n";
    span2.string = "\n```";

    i.insert(0, span1);
    i.append(span2);


imgs = soup.select('div#cnblogs_post_body img');

idx = 0;

for img in imgs:
    if img['alt'].encode('utf-8') == '复制代码':
        img.extract();
    else:
        span = soup.new_tag('span');
        span.string = "\n![](" + prefix + str(idx) + ".png)\n";
        img.insert_before(span);
        idx += 1;


body = soup.select('div#cnblogs_post_body');

contents = body[0].get_text().encode('utf-8');

contents = contents.encode('hex');

contents = contents.replace('e38080','').decode('hex');

contents = contents.replace('，',", ")
contents = contents.replace('（'," ( ")
contents = contents.replace('）'," ) ")


with open(prefix + ".txt","w") as fp:
    fp.write(contents);
