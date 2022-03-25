import { dedent } from 'dentist';

export default ({
  audio = ''
}) => dedent(`
<smil xmlns="http://www.w3.org/ns/SMIL" xmlns:epub="http://www.idpf.org/2007/ops" version="3.0">
 <body>
    ${audio}
 </body>
</smil>
`);