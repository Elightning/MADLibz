/* 
Eamon Lightning
eamon_lightning@student.uml.edu
Sound Recording Technology major; Computer Science minor.
Created on November 12, 2014

This web site (MADLibz) provides users the with the 
opportunity to partake in the traditional game of mad libs 
in an online environment. The site also contains information 
regarding the history of its fictious staff and a false means 
of contact, all for the sake of emulating a real-world site. 

This javascript file makes the site (MADLibz) more efficient by eliminating
its previously existing redundant code through the use of partial
html files. */

/* This code is based on several code examples provided by
Curran Kelleher, which can be found here: 
https://github.com/curran/screencasts/tree/gh-pages/navigation
*/

/* Wrapping everything in this mmediately invoked function ensures
that no global variables are introduced. */
(function () {

/* var partials holds previously retrieved partial html files, so
the task won't have to be repeated again. It serves as a cache. */
  var partials = {};

/* var Samples holds different text samples that are used as the templates
for the site's mad libs. Each text sample includes the words noun1, verb1, 
adjective1, and adverb1, which signal where in the template the input from 
the user will go. These four words are later substituted for the actual values
that are input by the user using the replace() method. */
  var Samples = {
    text1: "Hi, my name is noun1. I've never signed up for a adjective1 online dating site before, so all of this is new to me. In my free time I like to verb1, but it's more fun with two people :) . Maybe we can adverb1 get a drink sometime?",
    text2: "Sometimes, when nobody is looking, I just can't help but verb1. I once saw a noun1 do it too, so it can't be that bad. Still, it's my adjective1 secret. Maybe one day I can adverb1 tell the world about it, and they will respect me for it.",
    text3: "\"The noun1\" is the newest dance craze sweeping the nation. Basically, all you have to do is verb1 with your eyes closed. So the next time you go to a adjective1 dance party, be sure to bust it out adverb1.",
    text4: "noun1man is without a doubt the greatest super hero of all time. He could even level his most adjective1 opponents with a single verb1. The world can rest adverb1 knowing that he watches over us."
  };

/* Ascertains the current hash value of the location object and
calls getPartial() to retrieve the corresponding partial html file. */
  function find() {

    var fragmentID = location.hash.substr(1);

    getPartial(fragmentID);
  }

/* This function checks to see if the partial content it's 
retrieving has already been retrieved. If it has, then the 
content already exists in the partials variable, and so it is
retrieved from there. Otherwise, the get method uses an 
XMLHttpRequest to find the desired file and retrieve its content.
The content is then stored in the partials variable, and
assign() is called. */
  function getPartial(fragmentID) {
    if(partials[fragmentID]) { assign(partials[fragmentID], fragmentID); }
    else {
      $.get(fragmentID + ".html", function(content) {
        partials[fragmentID] = content;
        assign(content, fragmentID);
      });
    }
  }

/* assign() find the "content" div element in index.html and 
inserts the retrieved content there. In the case that the Fun.html
is begin retrieved, a lot more code is executed to give the mad libs
their dynamic capabilities. */
  function assign(content, fragmentID) {

/* Removes any existing mad lib from the page so that when a new
partial html file is loaded, the mad lib is no longer displayed. */
    $("#madLib").remove();
    
    $("#content").html(content);

/* Since the following code is only applicable when the Fun.html file is retrieved, 
a conitional is used to ensure that no time is wasted searching for DOM elements 
that don't yet exist if another partial html file is retrieved. */
    if(fragmentID === "Fun") {

/* Adds a callback to the form's Reset button, which is called whenever the click
event is fired. It removes any error message or mad lib which may have been on the 
page prior. */
      $("#reset").click(function() {
        $("#madLib").remove();
        $("#errorMessage").remove();;
      });

/* Adds a callback to the submit event. This callback tests for the validity of user
input and based on the results of the tests will either print an error message or a 
completed mad lib to the page. */ 
      $("form").submit(function() {

/* var text holds original string of text of the text sample that the user chooses to use. */ 
        var text;

/* var new_text holds the text that was modified after input from the user is added to the 
previously existing string of text. */
        var new_text;

/* var errorMessage holds the error message that is printed to the screen in case the user enters invalid values. */
        var errorMessage = "";

/* var errorLocation holds the names of the input fields that the user input invalid entries. */
        var errorLocation = [];

/* The after() method is used to append error messages and mad libs to the static content
of the Fun.html file. Therefore, whenever the submit event is fired, any previously displayed
error message or mad lib is removed from the page in order to allow new dynamic content to be
printed. If the remove() methods were not used, previously generated dynamic content wouldn't 
be removed from the page. */
        $("#madLib").remove();
        $("#errorMessage").remove();

/* These conditionals test whether or not a user input values in all of the five required fields. 
If they did not input a value for a field, the name of that field is added to the errorLocation array
and will be used later to print an error message. */
        if(Number(this.textSample.value) === 0) errorLocation[errorLocation.length] = " Text Sample";
        if(this.noun1.value.length === 0) errorLocation[errorLocation.length] = " Noun";
        if(this.verb1.value.length === 0) errorLocation[errorLocation.length] = " Verb";
        if(this.adjective1.value.length === 0) errorLocation[errorLocation.length] = " Adjective";
        if(this.adverb1.value.length === 0) errorLocation[errorLocation.length] = " Adverb";

/* If a user fails to input a value in one of the fields, the following code is executed, which is 
used to display the appropriate error message. */
        if (errorLocation.length !== 0) {
          
/* errorMessage is assigned the following initial value, which insures that the error message can be 
accessed later via its id to sytle it properly. */
          errorMessage = "<p id=\"errorMessage\">The ";

/* If there is only one error, a message is printed (singular) which informs the user of where they failed
to enter a value. */
          if (errorLocation.length === 1) {
            errorMessage += errorLocation[0] + " field is empty. Make a pick, dude. </p>";
          }

/* If there are multiple errors, a message is printed (plural) which informs the user of where they failed
to enter values. */
          else {
            for (i = 0; i < (errorLocation.length) - 1; i++) {
              errorMessage += errorLocation[i] + ",";
            }
            errorMessage += " and " + errorLocation[i] + " fields are empty. Make your picks, dude. </p>"
          }

/* The error message is printed after the Reset button just below the input fields. */
          $("#reset").after(errorMessage);
          
/* By returning false, the hash value of the location object does not change automatically,
which is a good thing because it means that the page won't reload and erase the error message
(that was added to the DOM in the previous line) right after the submit button is selected. */
          return false;
        }  

/* var text is assigned the original string of text of the text sample that the user chooses to use. 
At this point in the code, we know that the user has entered values in all of the fields, so the focus
now is replacing the words noun1, verb1, adjective1, and adverb1 with the corresponding values input
by the user. This is where the mad lib is built essentially. */
        text = Samples[this.textSample.value];
        new_text = text.replace("noun1", "<span class=\"underline\">" + this.noun1.value + "</span>");
        new_text = new_text.replace("verb1", "<span class=\"underline\">" + this.verb1.value + "</span>");
        new_text = new_text.replace("adjective1", "<span class=\"underline\">" + this.adjective1.value + "</span>");
        new_text = new_text.replace("adverb1", "<span class=\"underline\">" + this.adverb1.value + "</span>");
        var display = "<p id=\"madLib\">" + new_text + "</p>";
        
/* The mad lib is printed to the page after the content div. */
        $("#content").after(display);

/* By returning false, the hash value of the location object does not change automatically,
which is a good thing because it means that the page won't reload and erase the mad lib
(that was added to the DOM in the previous line) right after the submit button is selected. */
        return false;

      });
    }
  }

/* If the location object has no hash value, set it to 
#Home as a default. */
  if(!location.hash) { location.hash = "#Home"; }

/* Every time the page is loaded or refreshed, the corresponding
content of the hash value in the Location object is retrieved. */
  find();

/* Adds the callback function find to the hashchange event. This
event fires whenever the web page's fragmentID changes. */ 
  $(window).bind("hashchange", find);

} ());
