    /*
    * Sourced js text preview functions from: http://inimino.org/~inimino/blog/javascript_live_text_input
    */

    function reverse(s){return s.split('').reverse().join('')}

    function replaceNull(test,replacement){
    if(test == -1) return replacement; else return test;
    }

    function set(el,text){
    while(el.firstChild)el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(text))}

    /* setupUpdater will be called once, on page load.*/

    function setupUpdater(){
        var lastname=document.getElementById('lastname')
        , title = document.getElementById('title')
        , journal = document.getElementById('journal')
        , year = document.getElementById('year')
        , month = document.getElementById('month')
        , volume = document.getElementById('volume')
        , pages = document.getElementById('pages')
        , r_sourceWS = document.getElementById('sourceWS')
        , r_sourceJO = document.getElementById('sourceJO')
        , r_sourceJP = document.getElementById('sourceJP')
        , FullCitation = document.getElementById('FullCitation')
        , InTextCitation = document.getElementById('InTextCitation')
        , oldText=FullCitation.value
        , oldInText=InTextCitation.value
        , timeout = null;

        
      /* handleChange is called 50ms after the user stops
      typing. */
        
        function handleChange() {
            r_sourceWS.checked ? document.getElementById('div_url').removeAttribute('hidden') : document.getElementById('div_url').setAttribute('hidden',1);
                //Full citation value
            var newCitation = lastname.value + ' ' + title.value + '. '
                + journal.value + ' '
                + ((r_sourceJO.checked) ? '[Online] ' : ' ')
                + month.value + ' '
                + year.value;

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

            lastname.onkeydown = lastname.onkeyup = lastname.onclick =
            title.onkeydown = title.onkeyup = title.onclick =
            journal.onkeydown = journal.onkeyup = journal.onclick =
            year.onkeydown = year.onkeyup = year.onclick =
            month.onkeydown = month.onkeyup = month.onclick =
            volume.onkeydown = volume.onkeyup = volume.onclick =
            r_sourceJO.onclick = r_sourceJP.onclick = r_sourceWS.onclick =
            pages.onkeydown = pages.onkeyup = pages.onclick = eventHandler;
    }

    setupUpdater();
    document.getElementsByTagName('input')[0].focus();