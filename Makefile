
cat-config:
	@base64 -D -i ~/.panai-config-dev/panai-config.txt | python3 -c 'import sys, urllib.parse; print(urllib.parse.unquote(sys.stdin.read()))' | pbcopy
