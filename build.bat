@echo off
echo packing...
umi build
cls
echo prepare to upload
del manage.tar.gz
tar -cvf manage.tar.gz ./manage
scp ./manage.tar.gz sma@10.170.129.129:/home/sma/deploy/frontend/
