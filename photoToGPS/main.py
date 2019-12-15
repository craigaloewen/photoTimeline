import exifread
import json
import os
import ast


def EXIFDegToDecimalGPS(inputRatioValues):
    degree =  inputRatioValues[0].num / inputRatioValues[0].den
    minute =  inputRatioValues[1].num / inputRatioValues[1].den
    seconds =  inputRatioValues[2].num / inputRatioValues[2].den
    returnDegrees = degree + minute / 60 + seconds / 3600
    return returnDegrees

imageFiles=dict()

for img_name in os.listdir('../site/img/mapImages'):


  try:
    img=open('../site/img/mapImages/' + img_name, 'rb')

    tags=exifread.process_file(img)

    longitudeValues = tags['GPS GPSLongitude'].values
    latitudeValues = tags['GPS GPSLatitude'].values

    DateValue = ""

    if 'Image DateTime' in tags:
      DateValue = tags['Image DateTime'].printable
      DateValue = DateValue.replace(':','/',2)
    else:
      if 'GPS GPSDate' in tags: 
        DateValue = tags['GPS GPSDate'].printable
        DateValue = DateValue.replace(':','/',2)
      else: 
        raise Exception('No date detected')

    LatLonArray = [EXIFDegToDecimalGPS(latitudeValues),EXIFDegToDecimalGPS(longitudeValues)]

    if tags['GPS GPSLatitudeRef'].printable == 'S':
      LatLonArray[0] = -LatLonArray[0]

    if tags['GPS GPSLongitudeRef'].printable =='W':
      LatLonArray[1] = -LatLonArray[1]

    imageFiles[img_name]=dict()
    imageFiles[img_name]['LatLon'] = LatLonArray
    imageFiles[img_name]['DateTime'] = DateValue
  except:
    print("Error reading img: ",img_name)


with open('../site/img/imgGPSData.json', 'w') as json_file:
  json.dump(imageFiles, json_file)

print(tags)
