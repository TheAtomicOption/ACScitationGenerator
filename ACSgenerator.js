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
    }
//################ End Utility Functions ###################



/* setupUpdater will be called once, on page load.*/
    function setupUpdater(){
        var lastname=document.getElementById('lastname')
        , title = document.getElementById('title')
        , journal = document.getElementById('journal')
        , year = document.getElementById('year')
        , month = document.getElementById('month')
        , volume = document.getElementById('volume')
        , pages = document.getElementById('pages')
        , url = document.getElementById('url')
        , AYear = document.getElementById('AYear')
        , AMonth = document.getElementById('AMonth')
        , r_sourceWS = document.getElementById('sourceWS')
        , r_sourceJO = document.getElementById('sourceJO')
        , r_sourceJO_o = document.getElementById('sourceJO_o')
        , r_sourceJP = document.getElementById('sourceJP')
        , FullCitation = document.getElementById('FullCitation')
        , InTextCitation = document.getElementById('InTextCitation')
        , oldText=FullCitation.value
        , oldInText=InTextCitation.value
        , timeout = null;

        //abstracts field changes so the attributes don't have to be set on irrelevant data updates
        //mostly an excuse to play with arrays
        function SourceSwitch() {

            //define all fields and field lists for source types
            var allfields = [
                'div_url',
                'div_AYear',
                'div_AMonth',
                'div_sourceJO_o',
                'div_volume',
                'div_pages',
                'div_journal',
                'div_year',
                'div_month'
            ]
            , fieldsWS = [
                'div_url',
                'div_AYear',
                'div_AMonth',
            ]
            , fieldsJO = [
                'div_url',
                'div_AYear',
                'div_AMonth',
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
            ;

           //test which field is selected
            var sourcefields;
            r_sourceJO.checked ? sourcefields = fieldsJO : true;
            r_sourceWS.checked ? sourcefields = fieldsWS : true;
            r_sourceJP.checked ? sourcefields = fieldsJP : true;
                
            //loop through selected array to turn fields on/off
            for (var i = 0; i < allfields.length; i++) {
                if (sourcefields.indexOf(allfields[i]) > -1)
                { document.getElementById(allfields[i]).removeAttribute('hidden'); }
                else { document.getElementById(allfields[i]).setAttribute('hidden', 1); }
            }

            //All instances of a source switch should re-evaluate the citation.
            handleChange();
        }
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
                + ' (accessed ' + AMonth.value + ', ' + AYear.value + ')';

            }
            else if (r_sourceJP.checked) {
                newCitation = lastname.value + ' ' + title.value + '. '
                + '<i>' + journal.value + '</i> '
                + month.value + ' '
                + '<b>' + year.value + '</b>, '
                + '<i>' + volume.value + '</i>, '
                + pages.value + ' ';
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
                + ' (accessed ' + AMonth.value + ', ' + AYear.value + ')';
            }

              if (newCitation==oldText) return; else oldText=newCitation;
              set(FullCitation, newCitation);

              //In Text value
              var newInText = '(' + lastname.value.substr(0, replaceNull(lastname.value.indexOf(';'), lastname.value.length))
                  + (lastname.value.length - lastname.value.split(';').join('').length >= 2 ? 'et. al'
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

          r_sourceJO.onclick = r_sourceJP.onclick = r_sourceWS.onclick =
          r_sourceJO_o.onclick = r_sourceJO_o.onkeydown = r_sourceJO_o.onkeyup = SourceSwitch;

          lastname.onkeydown = lastname.onkeyup = lastname.onclick =
          title.onkeydown = title.onkeyup = title.onclick =
          journal.onkeydown = journal.onkeyup = journal.onclick =
          year.onkeydown = year.onkeyup = year.onclick =
          month.onkeydown = month.onkeyup = month.onclick =
          volume.onkeydown = volume.onkeyup = volume.onclick =
          url.onkeydown = url.onkeyup = url.onclick =
          AMonth.onclick = AMonth.onkeydown = AMonth.onkeyup =
          AYear.onclick = AYear.onkeydown = AYear.onkeyup =
          pages.onkeydown = pages.onkeyup = pages.onclick = eventHandler;
    }

    setupUpdater();
    document.getElementsByTagName('input')[0].focus();