let terminalTitle = '';
const font = 'Rammstein';
    figlet.defaults({fontPath: 'https://unpkg.com/figlet/fonts/'});
    figlet.preloadFonts([font], ready);

const url = 'https://v2.jokeapi.dev/joke/Programming';

const directories = {
    education: [
        '',
        '<aqua>Education</aqua>',

        '* <a href="https://cun.edu.co/">Corporacion Universitaria Nacional "CUN"</a> <yellow>"Ingenier Electronic"</yellow> 2018-2024',
        ' - <red>Courses offred by the university</red>',
        '   - <orange>HTML, CSS, JS, C++, ASSEMBLER, JAVA, Python, C#, </orange>',
        '* <a href="https://cun.edu.co/">Corporacion Universitaria Nacional "CUN"</a> <yellow>"Industrial Automation"</yellow> 2020-2021',
        ''
    ],
    projects: [
        '',
        '<aqua>Open Source projects</aqua>',
        [
            ['jQuery Terminal',
             'https://terminal.jcubic.pl',
             'library that adds terminal interface to websites'
            ],
            ['LIPS Scheme',
             'https://lips.js.org',
             'Scheme implementation in JavaScript'
            ],
            ['Sysend.js',
             'https://jcu.bi/sysend',
             'Communication between open tabs'
            ],
            ['Wayne',
             'https://jcu.bi/wayne',
             'Pure in browser HTTP requests'
            ],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<aqua>languages</aqua>',

        [
            'JavaScript',
            'TypeScript',
            'Python',            
            'SQL',
            'C',
            'C++',
            'C#',
            'Assembler'            
            
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        [
            'React.js',
            'Redux',
            'Jest',
            'Django',
            'Angular',

        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        [
            'Docker',
            'git',
            'Azure'
            
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const root = '~';
let cwd = root;
const dirs = Object.keys(directories);

function print_dirs() {
    term.echo(dirs.map(dir => {
        return `<blue class="directory">${dir}</blue>`;
    }).join('\n'));
}

function rainbow(string) {
    return lolcat.rainbow(function(char, color){
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;        
    }, string).join('\n');
}

function hex(color){
    return '#' + [color.red, color.green, color.blue].map(n=> {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

function ready(){
   
    terminalTitle = `${rainbow(render('Terminal Portfolio'))}<white>\nWelcome to my Terminal Portfolio\n</white><aqua>Please used commands how "help" to start</aqua>
                        <br> <orange> If you want a little smile typing "joke"</orange> </br>`;
    term.echo(terminalTitle);
    
}

function render(text){
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak:true
    });
}

function trim(str) {
    return str.replace(/[\n\s] + $/, '');
}

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});



const commands = {
    ls(dir = null) {
        if (dir) {
            if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1){
                    this.error('Directorio invalido');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Directorio invalido');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Directorio invalido');
            }
        } else if(cwd === root) {
            print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    cd(dir = null){
        if(dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Directorio equivocado');
        }
    },
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    echo(...args){
        if (args.length > 0){
        term.echo(args.join(' '));
        }
    },
    clear() {
        term.clear();
        term.echo(terminalTitle);
    },    
    async joke(){
        const res = await fetch(url);
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {

                const prompt = this.get_prompt();
                this.set_prompt('');

                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
                // we restore the prompt
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50,
                    typing: true
                });
            }
        })();
    },       
    credits() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    },
  
};

const user = 'rodriguezsebastian';
const server = 'gmail.com';
const command_list = Object.keys(commands);
const any_command_re = new RegExp(`^\s*(${command_list.join('|')}(.*))`);
const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

const formatted_list = command_list.map(cmd => {
    return `<white class = "command">${cmd}</white>`
});
const help = formatter.format(formatted_list);


function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}



$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.new_formatter([re, function(_, command, args) {
    return `<white>${command}</white><aqua>${args}</aqua>`;
}]);



const term = $('body').terminal(commands, {
    greetings:false,
    checkArity: false,
    completion(string){
        const cmd = this.get_command();
        const {name, rest} = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)){
            if(rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`)
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt,
    
});

term.on('click', '.command', function(){
    const command = $(this).text();
    term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function(){
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});



var tv = $('.tv');
function exit(){
    $('.tv').addClass('collapse');
    term.disable;
}
var __EVAL = (s) => eval(`void (__EVAL = ${__EVAL}); ${s}`);