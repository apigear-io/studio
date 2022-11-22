.PHONY: icons clean build dev


icons:

	mkdir Icon.iconset
	sips -z 16 16     Icon1024.png --out Icon.iconset/icon_16x16.png
	sips -z 32 32     Icon1024.png --out Icon.iconset/icon_16x16@2x.png
	sips -z 32 32     Icon1024.png --out Icon.iconset/icon_32x32.png
	sips -z 64 64     Icon1024.png --out Icon.iconset/icon_32x32@2x.png
	sips -z 128 128   Icon1024.png --out Icon.iconset/icon_128x128.png
	sips -z 256 256   Icon1024.png --out Icon.iconset/icon_128x128@2x.png
	sips -z 256 256   Icon1024.png --out Icon.iconset/icon_256x256.png
	sips -z 512 512   Icon1024.png --out Icon.iconset/icon_256x256@2x.png
	sips -z 512 512   Icon1024.png --out Icon.iconset/icon_512x512.png
	cp Icon1024.png Icon.iconset/icon_512x512@2x.png
	iconutil -c icns Icon.iconset
	rm -R Icon.iconset


clean:
	rm -rf build


build:
	wails build -debug -nsis --platform windows/amd64 -ldflags="-X 'main.version=v0.1.0' -X 'main.commit=12345' -X 'main.date=2022-11-22'"

dev:
	wails dev