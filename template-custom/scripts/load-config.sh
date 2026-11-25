# shellcheck shell=bash
# Reads project.config from the current folder (the project root).
# build.sh and start.sh source this file. Do not run it directly.
#
# Each KEY=VALUE line sets the shell variable CFG_<KEY>. Lines that start with "#" and empty lines are ignored.
# This file does not run the config as code. It only reads KEY=VALUE lines.

for _cfg_file in project.config; do
    [ -f "$_cfg_file" ] || continue
    _cfg_num=0
    while IFS= read -r _cfg_line || [ -n "$_cfg_line" ]; do
        _cfg_num=$((_cfg_num + 1))
        _cfg_line="${_cfg_line%$'\r'}"
        case "$_cfg_line" in
            "" | "#"*) continue ;;
        esac
        _cfg_key="${_cfg_line%%=*}"
        _cfg_value="${_cfg_line#*=}"
        if [ "$_cfg_key" = "$_cfg_line" ] || [[ ! "$_cfg_key" =~ ^[A-Z][A-Z0-9_]*$ ]]; then
            echo "[config] $_cfg_file line $_cfg_num is not KEY=VALUE. The line is ignored." >&2
            continue
        fi
        printf -v "CFG_${_cfg_key}" '%s' "$_cfg_value"
    done <"$_cfg_file"
done
unset _cfg_file _cfg_num _cfg_line _cfg_key _cfg_value
