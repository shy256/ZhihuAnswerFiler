// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("Zhihu Answer Filter v2024_4_3");
    const blacklist = [];
    const isVIP = false;
    const filterFunc = [
        {
            name: 'author in black list',
            filter: function(a){
                let author = a.querySelector(".AuthorInfo")
                author =author.querySelector('meta[itemprop=name]').getAttribute('content');
                if(blacklist.indexOf(author) != -1){
                    return false
                }
                return true;
            }
        },
        {
            name: 'paid novel trial',
            filter: function(a){            
                return !a.querySelector('div[class="KfeCollection-PaidAnswerFooter"]') || isVIP
            }
        },
        {
            name: 'paid novel trial',
            filter: function(a){            
                return !a.querySelector('div[class^="NavigateToAppCheckCard"]') || isVIP
            }
        },
        {
            name: 'paid novel trial',
            filter: function(a){     
                let target = a.querySelector('a[data-draft-type="link-card"]')       
                return !(target && target.href.indexOf('www.zhihu.com/market') != -1) || isVIP
            }
        },
    ]

    const targetNode = document.querySelector("[role=list]");
    const config = { attributes: false, childList: true, subtree: true };

    const filterMain = (a) => {
        for (let f of filterFunc) {
            if(!f.filter(a)){
                return Array(false, f.name);
            }
        }
        return Array(true, '');
    }
    const callback = () => {
        _observer.disconnect()
        var root = document.querySelectorAll(".List-item")
        root.forEach(i =>{
            try{
                if(i.getAttribute("hidden") != '1'){
                    let passed = filterMain(i);
                    let author = i.querySelector(".AuthorInfo")
                    author =author.querySelector('meta[itemprop=name]').getAttribute('content');
                    if(!passed[0]){
                        i.setAttribute("hidden", '1')
                        i.setAttribute("style","display:none;")
                        console.log(author + "'s answer is blocked. reason:" + passed[1])
                    }
                }
            }
            catch(e){
            }
        })
        _observer.observe(targetNode, config);
    };

    const _observer = new MutationObserver(callback);
    _observer.observe(targetNode, config);

    setTimeout(() => {
        callback();
    }, 1000);
})();
