Use leaflet for map 
Make the website static and statically interpret photos

https://leafletjs.com/


Library to convert EXIF data
https://github.com/perfectline/geopoint

Add in a Range slider from Bootstrap

Use Python to extract EXIF data
https://steemit.com/utopian-io/@steempytutorials/extracting-exif-meta-data-from-images-with-python

Development workflow:
- Add all the photos to a static album on the website
- Run a python script to generate a JSON file that exports all the EXIF GPS data of each image and its date when it was taken
- Add bootstrap to the website
- Make a UI that lets you select a timeline of when the photos are taken
- When the timeline UI is adjusted dynamically reload all of the image
    - Find a way to make the images load only when the new markers are added
    - Make a nice UI so when you click on the image it opens it up in a modal
- Add in clustering UI so it looks pretty 
- Add in a prettier base map (OPTIONAL)
