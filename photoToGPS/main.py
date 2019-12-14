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

    img=open('../site/img/mapImages/' + img_name, 'rb')

    tags=exifread.process_file(img)

    imageFiles[img_name]=dict()

    longitudeValues = tags['GPS GPSLongitude'].values
    latitudeValues = tags['GPS GPSLatitude'].values
    DateValue = tags['Image DateTime'].printable
    DateValue = DateValue.replace(':','/',2)

    LatLonArray = [EXIFDegToDecimalGPS(latitudeValues),EXIFDegToDecimalGPS(longitudeValues)]

    imageFiles[img_name]['LatLon'] = LatLonArray
    imageFiles[img_name]['DateTime'] = DateValue


with open('../site/img/imgGPSData.json', 'w') as json_file:
  json.dump(imageFiles, json_file)

print(tags)
