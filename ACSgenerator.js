    /*
    * Sourced js text preview structure from: http://inimino.org/~inimino/blog/javascript_live_text_input
    * Also got a lot of help from google links to StackOverflow. Seriously who codes without copying them anymore?
    * ############ Begin Utility functions ################
    */

    //replaces null and blank values with replacement argument
    function replaceNull(test,replacement){
    if(test == -1 || test == null || test == "") return replacement; else return test;
    }

    //sets the text of a tag
    //function set(el,text){
    //while(el.firstChild)el.removeChild(el.firstChild);
    //el.appendChild(document.createTextNode(text));}
    //above works, but can't handle html tags
    function set(el, text) {
        while (el.firstChild) el.removeChild(el.firstChild);
        el.innerHTML = text;
    }
    function cleanup() {
        var cl_year = document.getElementById('year');

        if (isNaN(cl_year.value.substr(0,4))) { cl_year.value = ''; }
        if (cl_year.value.length > 4) { cl_year.value = cl_year.value.substr(0, 4); }

        var cl_ayear = document.getElementById('AYear');

        if (isNaN(cl_ayear.value.substr(0, 4))) { cl_ayear.value = ''; }
        if (cl_ayear.value.length > 4) { cl_ayear.value = cl_ayear.value.substr(0, 4); }

        var cl_aday = document.getElementById('ADay');

        if (isNaN(cl_aday.value.substr(0, 2))) { cl_aday.value = ''; }
        if (cl_aday.value.length > 2) { cl_aday.value = cl_aday.value.substr(0, 2);}
    }
    function nth(d) {
        if(d>3 && d<21) return 'th'; // thanks kennebec
        switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    } 
//################ End Utility Functions ###################



/* setupUpdater will be called once, on page load.*/
    function setupUpdater(){
        var lastname=document.getElementById('lastname')
        , title = document.getElementById('title')
        , journal = document.getElementById('journal')
        , edition = document.getElementById('edition')
        , publisher = document.getElementById('publisher')
        , publisherLoc = document.getElementById('publisherLoc')
        , year = document.getElementById('year')
        , month = document.getElementById('month')
        , volume = document.getElementById('volume')
        , pages = document.getElementById('pages')
        , url = document.getElementById('url')
        , AYear = document.getElementById('AYear')
        , AMonth = document.getElementById('AMonth')
        , ADay = document.getElementById('ADay')
        , r_sourceWS = document.getElementById('sourceWS')
        , r_sourceJO = document.getElementById('sourceJO')
        , r_sourceJO_o = document.getElementById('sourceJO_o')
        , r_sourceJP = document.getElementById('sourceJP')
        , r_sourceBK = document.getElementById('sourceBK')
        , FullCitation = document.getElementById('FullCitation')
        , InTextCitation = document.getElementById('InTextCitation')
        , oldText=FullCitation.value
        , oldInText=InTextCitation.value
        , timeout = null;


        //abstracts field changes so the attributes don't have to be set on irrelevant data updates
        //mostly an excuse to play with arrays
        function SourceSwitch() {

            //define all fields and field lists for source types
            var fieldsAll = [
                'div_url',
                'div_AYear',
                'div_AMonth',
                'div_ADay',
                'div_sourceJO_o',
                'div_volume',
                'div_pages',
                'div_journal',
                'div_publisher',
                'div_publisherLoc',
                'div_year',
                'div_month',
                'div_edition'
            ]
            , fieldsWS = [
                'div_url',
                'div_AYear',
                'div_AMonth',
                'div_ADay'
            ]
            , fieldsJO = [
                'div_url',
                'div_AYear',
                'div_AMonth',
                'div_ADay',
                'div_sourceJO_o',
                'div_volume',
                'div_pages',
                'div_journal',
                'div_year',
                'div_month'
            ]
            , fieldsJP = [
                'div_volume',
                'div_pages',
                'div_journal',
                'div_year',
                'div_month'
            ]
            , fieldsBK = [
                'div_year',
                'div_volume',
                'div_pages',
                'div_publisher',
                'div_publisherLoc',
                'div_journal',
                'div_edition'
            ]
            ;

            //test which field is selected
            var sourcefields;
            r_sourceJO.checked ? sourcefields = fieldsJO : true;
            r_sourceWS.checked ? sourcefields = fieldsWS : true;
            r_sourceJP.checked ? sourcefields = fieldsJP : true;
            r_sourceBK.checked ? sourcefields = fieldsBK : true;

            //loop through selected array to turn fields on/off
            for (var i = 0; i < fieldsAll.length; i++) {
                if (sourcefields.indexOf(fieldsAll[i]) > -1)
                { document.getElementById(fieldsAll[i]).removeAttribute('hidden'); }
                else { document.getElementById(fieldsAll[i]).setAttribute('hidden', 1); }
            }

            //All instances of a source switch should re-evaluate the citation.
            handleChange();
        }
        SourceSwitch(); //run sourceSwitch on Pageload as soon as it's defined.

      /* handleChange is called 50ms after the user stops
      typing. */
        function handleChange() {
            
            cleanup();
            //Full citation value
            var newCitation = '';
            if (r_sourceWS.checked) {
                newCitation = lastname.value + ' ' + title.value + '. '
                    + journal.value + ' '
                    + replaceNull(url.value, "{Missing URL}")
                    + ' (accessed ' + AMonth.value + ' ' + ADay.value + ', ' + AYear.value + ').';
            }
            else if (r_sourceJP.checked) {
                newCitation = lastname.value + ' ' + title.value + '. '
                    + '<i>' + journal.value + '</i> '
                    + month.value + ' '
                    + '<b>' + year.value + '</b>, '
                    + '<i>' + volume.value + '</i>, '
                    + 'pp ' + pages.value + ' ';
            }
            else if (r_sourceJO.checked) {
                newCitation = lastname.value + ' ' + title.value + '. '
                    + '<i>' + journal.value + '</i> '
                    + '[' + r_sourceJO_o.value + '] '
                    + month.value + ' '
                    + '<b>' + year.value + '</b>, '
                    + '<i>' + volume.value + '</i>, '
                    + pages.value + ' '
                    + replaceNull(url.value, "{Missing URL}")
                    + ' (accessed ' + AMonth.value + ' ' + ADay.value +  ', ' + AYear.value + ').';
            }
            else if (r_sourceBK.checked) {
                newCitation = lastname.value + ' ' + title.value + '. '
                    + '<i>' + journal.value + '</i> '
                    + (edition.value.length > 0 ? ' ' + edition.value + '' + nth(edition.value) + ' ed.' : '')
                    + '' + publisher.value + ': ' + publisherLoc.value + ' '
                    + '<b>' + year.value + '</b>, '
                    + (volume.value.length > 0 ? '<i>' + volume.value + '</i>, ' : '')
                    + (pages.value.indexOf('-') > 0 ? 'pp ' : 'p ') + pages.value + ' ';
            }

              if (newCitation==oldText) return; else oldText=newCitation;
              set(FullCitation, newCitation);

              //In Text value ################################
              var newInText = '(' + lastname.value.substr(0, replaceNull(lastname.value.indexOf(';'), lastname.value.length))
                  + (lastname.value.length - lastname.value.split(';').join('').length >= 2 ? ' et. al'
                  : (lastname.value.length == lastname.value.split(';').join('').length ? ''
                  : ' and ' + lastname.value.substr(lastname.value.indexOf(';')+1, lastname.value.length - lastname.value.indexOf(';'))
                  ))
                   +', ' + year.value + ')' ;


              /*if (newInText==oldInText) return; else oldInText=newInText;*/
              if (newInText==oldInText) return; else oldInText=newInText;
              set(InTextCitation, newInText);
          }


          /* eventHandler is called on keyboard and mouse events.
          If there is a pending timeout, it cancels it.
          It sets a timeout to call handleChange in 50ms. */
          function eventHandler(){
              if(timeout) clearTimeout(timeout);
              timeout=setTimeout(handleChange, 50);
          }
            //SourceSwitch() events
          r_sourceJO.onclick =
              r_sourceJP.onclick =
              r_sourceWS.onclick =
              r_sourceBK.onclick =
              r_sourceJO_o.onclick =
              r_sourceJO_o.onkeydown =
              r_sourceJO_o.onkeyup =
              SourceSwitch;

        // eventHandler (text update) events
        lastname.onkeydown = lastname.onkeyup = lastname.onclick =
            title.onkeydown = title.onkeyup = title.onclick =
            journal.onkeydown = journal.onkeyup = journal.onclick =
            year.onkeydown = year.onkeyup = year.onclick =
            month.onkeydown = month.onkeyup = month.onclick =
            volume.onkeydown = volume.onkeyup = volume.onclick =
            url.onkeydown = url.onkeyup = url.onclick =
            AMonth.onclick = AMonth.onkeydown = AMonth.onkeyup =
            AYear.onclick = AYear.onkeydown = AYear.onkeyup =
            ADay.onclick = ADay.onkeydown = ADay.onkeyup =
            pages.onkeydown = pages.onkeyup = pages.onclick =
            publisher.onkeydown = publisher.onkeyup = publisher.onclick =
            publisherLoc.onkeydown = publisherLoc.onkeyup = publisherLoc.onclick =
            edition.onkeydown = edition.onkeyup = edition.onclick =
            eventHandler;
    }

    setupUpdater();
    document.getElementsByTagName('input')[0].focus();