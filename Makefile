.PHONY: dev deploy

dev:
	python3 -m http.server 8000

deploy:
	git add .
	git commit -m "$(msg)"
	git push
