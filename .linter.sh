#!/bin/bash
cd /home/kavia/workspace/code-generation/karavibe-32546-ae788930/kara_vibe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

