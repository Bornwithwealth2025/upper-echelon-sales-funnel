#!/usr/bin/env bash
# to call thid file use 
#source export-env.sh
# or
# . export-env.sh "first deployment mssage"
#ssh -i D://ludo-data/ludo administrator@155.117.43.6
export COMMIT_MESSAGE="${1:-first deployment}"
export PUSH_TO_GITHUB="true"
export APP_NAME="record-lead-app"
export APP_USER=""
export REMOTE_IP=""
export REMOTE_PATH=""
export APP_RUNNER_USER="" # the user that will run the app on the server
export BWWUSER="" # the user that will run the app on the server
export SERVER_DOMAIN_NAME=""

export SSH_KEY_PATH=""  # Fixed: Changed to Git Bash compatible path
export PM2_SHARED_DIR=""     # Shared location for PM2 data
