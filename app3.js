function demographic(sample) {
    d3.json("samples.json").then(data => {
        const metadata = data.metadata;
        console.log(metadata);

        var filter = metadata.filter(sampleId => sampleId.id == sample);
        var result = filter[0];
        var objdata = d3.select("#sample-metadata");

        objdata.html("");

        Object.entries(result).forEach(([key, value]) => {
            objdata.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function makeCharts(sample) {
    d3.json("samples.json").then((data) => {
        var sampleinfo = data.samples;

        var samplefilter = sampleinfo.filter(sampleId => sampleId.id == sample);
        var result = samplefilter[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Bubble Chart

        var bubbleLayout = {
        title: "Bacterial Cultures Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU Id"},
        };
    
        var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,                  
                colorscale: "YlGnBu",
            }
        }
     ];
    
     Plotly.newPlot("bubble", bubbleData, bubbleLayout);

     // Bar Chart

     var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
     var barChart = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: "rgb(142,124,195)"
            }
        }
      ];

     var layout = {
        title: "Top 10 OTU's",
        margin: { t:50, l:100, b:50, r:100},
      };

     Plotly.newPlot("bar", barChart, layout);
    });
};


function init() {
    var selectDropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var name = data.names;

        name.forEach((sample) => {
            selectDropdown.append("option").text(sample).property("value", sample);
        });

    var sampleData = name[0];
        demographic(sampleData);
        makeCharts(sampleData);
    });
};

function optionChanged(newSample) {
    demographic(newSample);
    makeCharts(newSample);
};

init()
