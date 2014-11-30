var fs = require('fs'),
    path = require('path'),
    marked = require('marked'),

    md_path = path.join(__dirname, 'md');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

function getMD(filename) {

    var data = fs.readFileSync(path.join(md_path, filename), 'utf8');
    return marked(data);
}


module.exports = {

    "common": {
        "siteTitle": "Kissakahvila Purnauskis",
        "menu": [{
            "href": "index.html",
            "text": "ETUSIVU"
        }, {
            "href": "kissat.html",
            "text": "KISSAT"
        }, {
            "href": "mauksi.html",
            "text": "MAUKSI"
        }, {
            "href": "yhteistyo.html",
            "text": "YHTEYSTYÖKUMPPANIT"
        },{
            "href": "yhteystiedot.html",
            "text": "YHTEYSTIEDOT"
        }, {
            "href": "en.html",
            "text": "ENGLISH"
        }]
    },

    "pages": [

        {
            "tpl": "index.dust",
            "path": "/index",
            "title": "Etusivu",

            "content": {
                "title": "Kissakahvila?",
                "body": getMD('index.md'),
                "img": [{
                    title: "Tutustu kissoihimme!",
                    src: "/img/tutustukissoihimme.jpg",
                    link: "kissat.html"
                }]
            }
        },

        {
            "tpl": "page.dust",
            "path": "/kissat",
            "title": "Kissat",

            "content": {
                "title": "Purnauskiksen pörheät kissat",
                "body": getMD('kissat.md')
            }
        },

        {
            "tpl": "page.dust",
            "path": "/mauksi",
            "title": "Mauksi",

            "content": {
                "title": "Mauksi",
                "body": getMD('mauksi.md')
            }
        },

        {
            "tpl": "page.dust",
            "path": "/yhteistyo",
            "title": "Yhteistyökumppanit",

            "content": {
                "title": "Yhteistyökumppanit",
                "body": getMD('yhteistyo.md')
            }
        },


        {
            "tpl": "page2.dust",
            "path": "/yhteystiedot",
            "title": "Yhteystiedot",

            "content": {
                "title": "Yhteystiedot",
                "body": getMD('yhteys.md')
            }
        },

        {
            "tpl": "page2.dust",
            "path": "/en",
            "title": "Cat café",

            "content": {
                "title": "Cat café",
                "body": getMD('en.md')
            }
        },

        {
            "tpl": "booking.dust",
            "path": "/varaus",
            "title": "Varauskalenteri",

            "content": {
                "title": "Varauskalenteri",
                "body": getMD('varaus.md')
            }
        }

    ]

};
