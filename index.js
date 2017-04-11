const	path= require('path'),
		fs= require('fs');

const	program= require('commander'),
		_= require('underscore'),
		glob= require('glob');

program
	.option('-l, --list <list>', 'Specify file list')
	.option('-s, --src <dir>', 'Search in the directory')
	.option('-d, --dst <dir>', 'Copy to the directory')
	.parse(process.argv);

const	list= _.uniq(require(path.resolve(program.list))),
		src= path.resolve(program.src),
		dst= path.resolve(program.dst);

console.log(list.length);
console.log(src);
console.log(dst);
console.log('----');

const	copy= (file)=>{

	return new Promise((resolve, reject)=>{
		glob(src+'/**/'+file, {}, (err, files)=>{

			if(err){
				console.log('Glob error', file);
				resolve();
				return;
			}

			if(!files.length){
				console.log('Not found', file);
				resolve();
				return;
			}

			const r= fs.createReadStream(files.shift())
				.on('error', (err)=>{
					console.log('Read error', file);
					resolve();
					return;
				});

			const w= fs.createWriteStream(dst+'/'+file)
				.on('error', (err)=>{
					console.log('Write error', err);
					resolve();
					return;
				})
				.on('close', ()=>{
					console.log('Success', file);
					resolve();
				});

			r.pipe(w);
		});
	});
};

list
	.reduce(
		(prev, curr)=>{
			return prev.then(()=>{
				return copy(curr);
			});
		},
		Promise.resolve()
	)
	.then(()=>{
		console.log('OK');
	}, (err)=>{
		console.log(err);
	});
