// Web command line.
// Russ Cox <rsc@swtch.com>, February 2007 
// IE syntax fixes (no trailing commas), March 2008

const input = document.getElementById("form")
input.addEventListener("submit", (e) => {
    e.preventDefault();
    const textBox = document.getElementById("line");
    runcmd(textBox.value)
})

const shortcuts = {
    "m": "https://mail.google.com/",
    "c": "https://www.google.com/calendar",
    "r": "https://reddit.com/",
    "bb": "https://boingboing.net/"
};

const searches = {
    "a": ["https://www.amazon.com/s", "field-keywords",
        { "url": "search-alias=aps" }],
    "g": ["https://www.google.com/search", "q"],
    "gi": ["https://www.google.com/images", "q"],
    "w": ["https://en.wikipedia.org/wiki/Special:Search", "search"],
    "rr": ["https://reading-room.csail.mit.edu/cgi-bin/user/search.cgi", "search",
        { "database": "all", "order": "desc", "case": "not" }],
    "y": ["https://www.youtube.com/results", "q"],
    "t": ["https://www.twitch.tv/search", "term"]
};

function runcmd(cmd) {
    let space = cmd.indexOf(' ');
    if (space == -1 && (cmd.indexOf('/') != -1 || cmd.indexOf('.') != -1)) {
        if (cmd.indexOf('://') == -1)
            cmd = "http://" + cmd;
        window.location = cmd;
        return false;
    }
    if (space == -1) {
        arg = "";
        args = new Array();
    } else {
        arg = cmd.substr(space + 1);
        cmd = cmd.substr(0, space);
        args = toarray(arg.split(/\s+/));
    }
    let fn;
    if (searches[cmd] != undefined)
        fn = search;
    else if (shortcuts[cmd] != undefined)
        fn = shortcut;
    else {
        toastr.error("no command: " + cmd);
        return false;
    }
    fn(cmd, arg, args);
    return false;
}

function toarray(args) {
    let a = new Array();
    for (let i = 0; i < args.length; i++)
        a[i] = args[i];
    return a;
}

function cgiurl(base, params) {
    let url = base + "?";
    for (let k in params)
        url += k + "=" + escape(params[k]) + "&";
    return url;
}

function search(cmd, arg, _) {
    let a = searches[cmd][2];
    if (a == undefined)
        a = {};
    a[searches[cmd][1]] = arg;
    window.location = cgiurl(searches[cmd][0], a);
}

function shortcut(cmd, _, _) {
    window.location = shortcuts[cmd];
}