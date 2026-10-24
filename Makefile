.PHONY: dev build staging studio clean

dev:
	scripts/hugo.sh development server --disableFastRender

staging:
	scripts/hugo.sh staging --gc --minify

build:
	scripts/hugo.sh production --gc --minify

studio:
	cd studio && npm run dev

clean:
	rm -rf public resources/_gen
