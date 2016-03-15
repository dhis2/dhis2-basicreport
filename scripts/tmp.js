//Period type         Period id       Period name

//Financial October   2015Oct         Oct 2015 to Sep 2016
//Financial July      2015July        Jul 2015 to Jun 2016
//Financial April     2015April       Apr 2015 to Mar 2016
//Yearly              2015            2015
//Six-monthly April   2015AprilS1     Apr to Sep 2015
//Six-monthly April   2015AprilS2     Oct to Mar 2014
//Six-monthly         2015S1          Jan to Jun 2015
//Quarterly           2015Q1          Jan to Mar 2015
//Bi-monthly          201501B         Jan to Feb 2015
//Monthly             201501          January 2015
//Weekly              2015W1          2015W1
//Daily               20150101        2015-01-01


iso: "2015April"

startDate: "2015-04-01"
endDate: "2016-03-31"


---
week

iso: "2015W18"

startDate: "2015-04-27"
endDate: "2015-05-03"


var P = BR.instances[0].core.api.data.Period;
var p = new P({});
p.gen('Daily');
