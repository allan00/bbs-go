#!/bin/sh
if [ -f "progressId.pid" ] ; then
    kill -9 `cat progressId.pid`
    rm progressId.pid
fi

processes=$(ps -ef | grep bbs-go | grep -v grep |awk '{print;}')

for p in $processes;do
        echo $p
done