# Visual Analasyis Tool

This is a web based visual analysis tool for visualizing multivariate time-series data collected from a project home on space-defining elements in performative architecture.
It was developed as for a bachelor thesis at ETH Zurich and based on a field study conducted (https://mosayebi.arch.ethz.ch/en/research/).
It is implemented in JavaScript (mainly D3.js), HTML and CSS.

## Description

The tool is based on two different datasets: the sensor data on various elements in the project home of the study, 
and test-subject data including various meta-information.

The Tool consits of two views, the main view and the animation view.
The main view offers two modes, either the Single Group View or the Two-Group Comparison View.
The animation view contains animation of the sensor data.
A description and instuctions when needed are included in the tool.

## Usage
There are two ways to use the tool.
The first is to open the application in a webbrowser of your choosing at https://eayumi.github.io. It is advised to use Chrome or Microsoft Edge.
The second option is to use a local host. Users with a Mac computer should use the first option.

The user needs only internet access and open a local host.
To use the tool, open the file index_main.html with a local host in the browser of your choosing.

If not known how to open a local host, one way is with by the live-server command of Node.js and npm.

1. Go to https://nodejs.org/ and download Node.js
1. Check that everything is installed sucessfully by checking the installed versions of Node.js and npm.
    ```bash
    node -v
    npm -v
    ```
1. Open the terminal (or Command Prompt) and install live-server by:
    ```bash
    npm install -g live-server
    ```
1. Now whenever you want to open the visual tool, open the terminal and navigate to the project directory using cd (eg. if you have saved the project folder in the Documents folder of your desktop:  C:\Users\JohnDoe\Documents\project_folder)
    ```bash
    cd C:\Users\JohnDoe\Documents\project_folder
    ```
You will then see something in this manner:
    ```bash
    C:\Users\JohnDoe\Documents\project_folder>
    ```
1. Now simply type:
    ```bash
    live-server
    ```
    This should open the project folder in a web browser.
    Now click the appropriate html file to start the tool (index_main.html) or update the data files (see below).


## Updating Data Files

For inserting new data, follow these steps:

First update data on the test-subjects and dates of special use of the Mock-up.
1. Open the file Bewohner.xlsx in Microsoft Excel. Modify or add any entry necessary. Make sure to follow these rules:
    1. Do not modify the structure.
    1. Make sure to write _entfällt_ if the _Person 1_ column if the corresponding week is to be removed.
    1. Do not write anything in the _Person 2_ column if there is only a single test-subject.
    1. Gender is to be described by _w_ (woman) or _m_ (man) only.
    1. OccupationCategory needs to start with the letter _A,B,C,D_.
    1. Consitencies is to be described by _Alles_ (everything), _Keine_ (none), or any other strings (parts).
1. Save the file as a csv file under _Bewohner_ in the _data_ folder and convert the file to JSON format. This can be done eg. online (https://csvjson.com/csv2json). Make sure you save the file as *Bewohner.json* in the *data* folder.
1. Open the file Sondernutzungen.csv and add any dates to be removed. Do this analogously to the earlier step, or directly open the Sondernutzungen.json file in a file editor and add the dates.

Then add new sensor data:
1. Go to https://ethz-mock-up.private-cloud.ch/prod/sensordata/ and download all. This is a CSV file.
1. Convert the file to JSON format. This can be done eg. online (https://csvjson.com/csv2json). Make sure you save the file as *data_raw.json* in the *data* folder.
1. Open the index_clean_data_raw.html file in a local host. This cleans up the data_raw by removing any data portions specified to be removed by the Bewohner and Sondernutzungen file.
1. Open the index_perpare_data.html file in a local host. This prepares four different json files. Save them with their given name in the _data_ folder.

Then calculate the trace files. This will be computationally intensive and takes a while (think hours). To make sure everything is done correctly, you may also contact me personally and I will do this step for you.
1. Open the index_prepare_trace_files.html file and follow the instructions.
    1. Click button Step 1.1 through 1.6. Be sure to go through each step one-by-one. This will take a while and download a lot of files onto your desktop. After the end of Step 2, they can be deleted. This step finds all words of wordlength 5 and 10 and occurences over the whole sensor dataset. Move all the files to the folder *data/data_trace*.
    1. Click button Step 2.1 through 2.6. This will take a while and download a lot of files (+2000) onto your desktop. This step counts the occurences of words for different combinations of attributes.  Move all the files to the folder *data/data_trace_prefiltered*.

## Support

For any questions or problems, contact me under ehgartner.ayumi@gmail.com .

## Project status

This contains all the data files upto and including 23.08.2020.
The study is still being conducted and expected to end at the end of 2020.

Created: 10.10.2020, Lucerne, Switzerland.