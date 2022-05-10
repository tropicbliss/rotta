// Web command line.
// Russ Cox <rsc@swtch.com>, February 2007 
// IE syntax fixes (no trailing commas), March 2008

var shortcuts = {
    "m": "https://mail.google.com/",
    "c": "https://www.google.com/calendar",
    "r": "http://reddit.com/",
    "bb": "http://boingboing.net/"
}

var searches = {
    "a": ["http://www.amazon.com/s", "field-keywords",
        { "url": "search-alias=aps" }],
    "g": ["http://www.google.com/search", "q"],
    "gi": ["http://www.google.com/images", "q"],
    "w": ["http://en.wikipedia.org/wiki/Special:Search", "search"],
    "rr": ["http://reading-room.csail.mit.edu/cgi-bin/user/search.cgi", "search",
        { "database": "all", "order": "desc", "case": "not" }],
    "y": ["https://www.youtube.com/results", "q"],
    "t": ["https://www.twitch.tv/search", "term"]
}

function runcmd(cmd) {
    var space = cmd.indexOf(' ');
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
    var fn;
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
    var a = new Array();
    for (var i = 0; i < args.length; i++)
        a[i] = args[i];
    return a;
}

function cgiurl(base, params) {
    var url = base + "?";
    for (var k in params)
        url += k + "=" + escape(params[k]) + "&";
    return url;
}

function search(cmd, arg, _) {
    var a = searches[cmd][2];
    if (a == undefined)
        a = {};
    a[searches[cmd][1]] = arg;
    window.location = cgiurl(searches[cmd][0], a);
}

function shortcut(cmd, _, _) {
    window.location = shortcuts[cmd];
}