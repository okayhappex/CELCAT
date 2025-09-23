const BASEURL = 'https://celcat-back.onrender.com/edt';
let CALSCOPE = new Date();
let GRPSCOPE = 1;

const verb = d => {
    const yr = d.slice(0, 4);
    const mo = d.slice(4, 6);
    const da = d.slice(6, 8);
    return `${yr}-${mo}-${da}`;
};

const fwdicon = _class => {
    return `<svg data-slot="icon" class="${_class}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3.288 4.818A1.5 1.5 0 0 0 1 6.095v7.81a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905a1.5 1.5 0 0 0 0-2.552l-6.323-3.906A1.5 1.5 0 0 0 10 6.095v2.972a1.506 1.506 0 0 0-.389-.343L3.288 4.818Z"/>
    </svg>`;
}

const bwdicon = _class => {
    return `<svg data-slot="icon" class="${_class}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M7.712 4.818A1.5 1.5 0 0 1 10 6.095v2.972c.104-.13.234-.248.389-.343l6.323-3.906A1.5 1.5 0 0 1 19 6.095v7.81a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.505 1.505 0 0 1-.389-.344v2.973a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.5 1.5 0 0 1 0-2.552l6.323-3.906Z"/>
    </svg>`;
}

const icons = {
    forward: fwdicon,
    backward: bwdicon,
};

async function precharger(range = 5, fstart) {
    let _start = new Date(fstart);

    // Revenir au lundi si ce n’est pas le cas
    if (_start.getDay() !== 1 && range !== 1) {
        _start.setDate(_start.getDate() - _start.getDay());
    }

    let div = document.getElementById('timetable');

    // Reset timetable
    div.innerHTML = '';

    const _HRS = [
        '',
        '8h00', '9h00', '10h00', '11h00', '12h00', '13h00', '14h00',
        '15h00', '16h00', '17h00', '18h00', '19h00', '20h00'
    ];

    const DAYS = [
        'Lundi', 'Mardi', 'Mercredi', 'Jeudi',
        'Vendredi', 'Samedi', 'Dimanche'
    ];

    for (let col = 0; col <= range; col++) {
        let day = document.createElement('div');
        day.classList.add(col === 0 ? 'w-24' : 'flex-1')
        if (range == 5) day.classList.add('border-r', 'border-slate-500/15');

        for (let row = 0; row < 25; row++) {
            if (col === 0) {
                if (row <= 12) {
                    let _id = 'h-' + (750 + row * 50).toString();

                    let hour = document.createElement('div');
                    hour.id = _id;

                    let _label = document.createElement('div');

                    let span = document.createElement('span');
                    span.innerText = _HRS[row];
                    span.classList.add('grow', 'px-4');

                    if (row === 0) {
                        span.classList.add('font-bold', 'text-center');
                    } else {
                        span.classList.add(
                            'text-slate-700', 'text-sm', 'text-right',
                            'font-semibold', 'dark:text-slate-300'
                        );
                    }

                    let span2 = document.createElement('span');
                    span2.innerText = _HRS[row + 1];
                    span2.classList.add('grow', 'px-4');

                    if (row === 0) {
                        span2.classList.add('font-bold', 'text-center');
                    } else {
                        span2.classList.add(
                            'text-slate-500', 'text-xs', 'text-right',
                            'font-medium', 'dark:text-slate-500'
                        );
                    }

                    if (row == 0) {
                        hour.appendChild(span);
                        hour.classList.add('flex', 'items-center', 'h-16', 'z-50');
                    } else {
                        _label.appendChild(span);
                        _label.appendChild(span2);

                        _label.classList.add('flex', 'flex-col', 'w-full');
                        hour.classList.add('flex', 'items-center', 'h-16', 'z-50');
                        hour.appendChild(_label);
                    }

                    day.appendChild(hour);
                }
            } else {
                if (row === 0) {
                    let _id = range === 1
                        ? DAYS[new Date(_start).getDay() - 1]
                        : DAYS[col - 1];

                    let hour = document.createElement('div');
                    hour.id = _id;

                    let span = document.createElement('span');
                    span.innerText = _id + ' ' + _start.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit'
                    });
                    _start.setDate(_start.getDate() + 1);
                    span.classList.add('grow', 'text-center', 'font-bold');
                    hour.appendChild(span);

                    hour.classList.add(
                        'flex', 'items-center',
                        'h-16', 'z-50'
                    );

                    /*if (range == 5)*/ hour.classList.add('border-b', 'border-slate-500/5');

                    day.appendChild(hour);
                } else {
                    let _id = range === 1
                        ? (750 + row * 50).toString()
                        : col.toString() + '-' + (750 + row * 50).toString();

                    let hour = document.createElement('div');
                    hour.id = _id;

                    let __border = row % 2 === 1 ? 'border-transparent' : 'border-slate-500/5';
                    hour.classList.add('h-8', 'z-50');
                    /*if (range == 5)*/ hour.classList.add('border-b', __border);

                    day.appendChild(hour);
                }
            }
        }
        div.appendChild(day);
    }
}

async function load_buttons(start, end, chosen = null) {
    let skipdiv = document.getElementById('btnskip');
    skipdiv.innerHTML = '';

    let grpdiv = document.getElementById('btngrp');
    grpdiv.innerHTML = '';

    let add, range = 0;

    if (window.innerWidth < 640) {
        add = 1;
        range = 1
    } else {
        add = 7;
        range = 5;
    }

    let btnprev = document.createElement('button');
    btnprev.classList.add(
        'text-sm', 'font-semibold', 'border-b-2', 'border-transparent',
        'px-4', 'py-2', 'duration-300', 'hover:border-slate-500/25'
    );
    btnprev.innerHTML = icons.backward('fill-slate-950 inline h-5 w-5 dark:fill-white');

    btnprev.onclick = async () => {
        await charger_calendrier(-1, -add, range);
    }

    let btnnext = document.createElement('button');
    btnnext.classList.add(
        'text-sm', 'font-semibold', 'border-b-2', 'border-transparent',
        'px-4', 'py-2', 'duration-300', 'hover:border-slate-500/25'
    );
    btnnext.innerHTML = icons.forward('fill-slate-950 inline h-5 w-5 dark:fill-white');

    btnnext.onclick = async () => {
        await charger_calendrier(-1, add, range);
    }


    grpdiv.appendChild(btnprev);

    const groups = ['A1', 'A2', 'B1', 'B2'];

    for (let i = 0; i < groups.length; i++) {
        let btngrp = document.createElement('button');
        btngrp.classList.add(
            'text-sm', 'font-semibold', 'border-b-2',
            'px-4', 'py-2', 'duration-300'
        );
        if (chosen === i) btngrp.classList.add('border-rose-500');
        else btngrp.classList.add('border-transparent', 'hover:border-slate-500/25');

        btngrp.innerText = groups[i];

        btngrp.onclick = async () => {
            await charger_calendrier(i, 0, range);
            await load_buttons(start, end, i);
        }

        grpdiv.appendChild(btngrp);
    }

    grpdiv.appendChild(btnnext);
}

async function charger_calendrier(grp, add = 0, range = 5) {
    if (grp !== -1) GRPSCOPE = grp;

    if (range == 5) {
        diff = CALSCOPE.getDate() - CALSCOPE.getDay() + 1;
        CALSCOPE.setDate(diff + add);
    } else {
        CALSCOPE.setDate(CALSCOPE.getDate() + add);
    }

    const urls = [
        'G1-QJ2DMFYC5987', // MMI1-A1
        'G1-PW2GUKMM5988', // MMI1-A2
        'G1-HN2CHYNX5990', // MMI1-B1
        'G1-QW2SJTJH5991'  // MMI1-B2
        // etc.
    ];

    const fstart = CALSCOPE.toISOString().split('T')[0];

    let __end = new Date(fstart);
    __end.setDate(__end.getDate() + range - 1);

    const fend = __end.toISOString().split('T')[0];
    const url = `${BASEURL}/${urls[GRPSCOPE]}?start=${fstart}&end=${fend}`;
    console.log(url);

    const res = await fetch(url);
    const data = await res.json();

    precharger(range, fstart);

    for (const event of data) {
        let _evtype = 'UNKNOWN';
        if (new Date(event.end) <= new Date()) _evtype = 'CURR';
        else if (event.summary.includes('Cours Magistraux')) _evtype = 'CM';
        else if (event.summary.includes('Travaux Dirigés')) _evtype = 'TD';
        else if (event.summary.includes('DS')) _evtype = 'DS';
        else if (event.summary.includes('projet tutore')) _evtype = 'TUT';
        else if (event.summary.includes('Travaux Pratiques')) _evtype = 'TP';

        let _evstart = new Date(event.start);
        let _evend = new Date(event.end);
        _running = new Date(event.start) <= new Date() && new Date <= new Date(event.end)

        let col = range === 5
            ? (_evstart.getDay() === range ? range : _evstart.getDay() % range)
            : 1;

        let row = _evstart.getHours() * 100 + Math.round(_evstart.getMinutes() / 6) * 10;
        let _id = range === 1 ? row.toString() : `${col}-${row}`;

        const colors = {
            'PAST': 'slate-500',
            'CM': 'fuchsia-600',
            'TD': 'emerald-500',
            'TP': 'indigo-700',
            'DS': 'red-400',
            'TUT': 'rose-500',
            'UNKNOWN': 'slate-500'
        };


        // Contenu des cours
        let eltitle = document.createElement('span');
        eltitle.innerText = event.summary.split(' - ')[1]?.split(';')[0] ?? event.summary;
        eltitle.classList.add('text-sm', 'font-bold');

        let elprof = document.createElement('span');
        elprof.innerText = event.description?.split(';')[0] ?? 'Prof Inconnu';
        elprof.classList.add('block', 'text-xs', 'font-medium');

        let eldate = document.createElement('span');
        
        eldate.classList.add(`text-${colors[_evtype]}`, 'block', 'text-2xs', 'font-semibold');

        if (_running) {
            eldate.innerText = `${_evstart.toLocaleTimeString('fr-FR').slice(0, 5)}-${_evend.toLocaleTimeString('fr-FR').slice(0, 5)} | ${event.location || 'Salle Inconnue'}`;
            eltitle.classList.add(`text-${colors[_evtype]}`);
            elprof.classList.add(`text-${colors[_evtype]}`);
        } else {
            eldate.innerText = `• EN COURS | ${event.location || 'Salle Inconnue'}`;
        }

        const duration = (_evend - _evstart) / 1000 / 60;
        const size = Math.round(duration / 3.75).toString();

        let elcontent = document.createElement('div');
        elcontent.classList.add('grow', 'text-2xs', 'font-semibold', 'pl-2', 'py-1');

        if (size > 12) elcontent.appendChild(eldate);
        elcontent.appendChild(eltitle);
        if (size > 16) elcontent.appendChild(elprof);

        let eltag = document.createElement('div');
        eltag.classList.add(`bg-${colors[_evtype]}`, 'rounded-full', 'p-1');

        let elbox = document.createElement('div');
        elbox.classList.add(
            'flex', `bg-${colors[_evtype]}/10`, 'rounded-xl', 'p-2',
            'h-full', 'duration-300', `hover:bg-${colors[_evtype]}/15`
        );
        elbox.id = 'cours_' + _id;

        elbox.appendChild(eltag);
        elbox.appendChild(elcontent);

        if (parseInt(size) < 32) eltitle.classList.add('line-clamp-1');

        let elcontainer = document.createElement('div');
        elcontainer.classList.add('items-stretch', 'p-0.5', `h-${size}`);
        elcontainer.appendChild(elbox);

        let target = document.getElementById(_id);
        if (target) target.appendChild(elcontainer);
    }
}

async function fstload() {
    if (window.innerWidth < 640) {
        load_buttons(0, 4, 1)
        await charger_calendrier(1, 0, 1);
    } else {
        load_buttons(0, 4, 1)
        await charger_calendrier(1, 0, 5);
    }

}






