var d= activeDocument,
	x= new XML(d.XMPString),
	xpath= x.xpath('//stRef:filePath'),
	i,
	path,
	paths= [],
	list;

if(xpath!==''){

	for(i=0; i<xpath.length(); i++){
		if(!File(xpath[i]).exists){
			paths.push('"'+File(xpath[i]).name+'"');
		}
	}

	list= new File(d.path+'/'+d.name+'-items.json');
	list.open('w');
	list.write('[');
	list.write(paths.join(','));
	list.write(']');
	list.close();
}
