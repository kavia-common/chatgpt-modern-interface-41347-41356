#!/bin/bash
cd /home/kavia/workspace/code-generation/chatgpt-modern-interface-41347-41356/chatgpt_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

