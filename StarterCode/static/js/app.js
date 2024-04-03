//Defines JSON URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Read the JSON data
let data = d3.json(url).then(function(data) {
    console.log(data);
});

//Dashboard

function init () {
    //Select dropdown menu with D#
    let dropdownMenu = d3.select("#selDataset");
    //Populate dropdown menu with id's
    d3.json(url).then(function(data) {
        let sampleNames = data.names;
        //Arrays
        sampleNames.forEach((name) => {
            dropdownMenu.append("option")
            .text(name)
            .property("value", name);
        });

            //First Sample
            let firstSample = sampleNames[0]
            //console.log(firstSample)

            //Initialize Plots
            buildBarPlot(firstSample);
            buildBubblePlot(firstSample);
            buildMetadata(firstSample);
    });

};

init()

//Metadat Function Panel
function buildMetadata (sampleID) {
    d3.json(url).then(function(data) {
        let metadata = data.metadata;
        let sampleArray = metadata.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        let panel = d3.select("#sample-metadata");
        panel.html("");
        //Loop through each key and append data to panel
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+": "+sample[key])
        }
    })
}

//Bar Plot Function
function buildBarPlot (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    let otu_ids = sample.otu_ids
    let sample_values = sample.sample_values
    let otu_labels = sample.otu_labels
    
    let trace1 = [
        {x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h" }
    ];
    //Layout
    let layout = {
        title:""
    };

    //Plots using Plotly
    Plotly.newPlot("bar", trace1, layout)

    });

};

//Bubble Plot Function
function buildBubblePlot (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

    
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    
    
    let otu_ids = sample.otu_ids
    let sample_values = sample.sample_values
    let otu_labels = sample.otu_labels
    
    
    let trace2 = [
        {x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode:"markers",
         marker:{
            size: sample_values, 
            color: otu_ids,
            colorscale: "Earth"
         }
         
        }];

    
    let layout = {
        xaxis: {title:"OTU ID"}
    };
    //Using Plotly to plot again
    Plotly.newPlot("bubble", trace2, layout)

    });
};

//Change Function
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    buildBarPlot(sampleID);
    buildBubblePlot(sampleID);
};