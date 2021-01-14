@echo off
echo 正在打包项目...
cls

echo 准备上传文件
umi build
del manage.tar.gz
tar -cvf manage.tar.gz ./manage
scp ./manage.tar.gz sma@10.170.129.129:/home/sma/deploy/frontend/
