.PHONY: build clean deploy lint start test

start:
	@npx parcel -p 4000 index.html

build:
	@npx parcel build index.html --public-url .

sounds:
	@npx audiosprite -e mp3 -f howler -o assets/sounds assets/audio/*.wav

deploy: build
	@aws s3 sync ./dist/ s3://tetris.joshbassett.info/ --acl public-read --delete --cache-control 'max-age=300'

test: lint

lint:
	@npx standard "src/**/*.js"

clean:
	@rm -rf dist node_modules
