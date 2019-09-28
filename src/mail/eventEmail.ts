import { IEventEmailOptions, IEventEmailTemplate } from '../types';

const creationTemplate = (options: IEventEmailOptions): IEventEmailTemplate => {
  const { title, type, date, eventUrl, creator, description } = options;

  const desc = description || 'ei tarkempaa kuvausta.';

  const mjmlText = `
<mjml>
<mj-body>
  <mj-raw>
    <!-- Company Header -->
  </mj-raw>
  <mj-section background-color="#f0f0f0">
    <mj-column>
      <mj-text font-size="20px">Downtown65.events </mj-text>
      <mj-text background-color="white" font-weight="bold" font-size="30px" font-family="Helvetica Neue">
        Uusi tapahtuma
      </mj-text>
    </mj-column>
    <mj-column>
      <mj-image width="100px" src="https://storage.googleapis.com/downtown65/logos/logo_black.png"></mj-image>
    </mj-column>
  </mj-section>
  <mj-raw>
    <!-- Image Header -->
  </mj-raw>
  <mj-section background-url="https://storage.googleapis.com/downtown65/events/${type}.jpg" background-size="cover" background-repeat="no-repeat">
    <mj-column width="600px">
      <mj-text align="center" font-size="30px" font-weight="bold" font-family="Helvetica Neue" color="white">${type}</mj-text>
      <mj-button background-color="#FF80EA" href="${eventUrl}">Näytä tapahtuma</mj-button>
    </mj-column>
  </mj-section>

  <mj-section background-color="#eeeeee">
    <mj-column width="400px">
      <mj-text font-size="20px" font-family="Helvetica Neue" color="#626262">${title}</mj-text>
      <mj-text font-style="italic" font-size="16px" font-family="Helvetica Neue" color="#626262">${date}</mj-text>
      <mj-text color="#525252">${desc}</mj-text>
    </mj-column>
  </mj-section>
  <mj-section background-color="#dfdfdf">
    <mj-column width="400px">
      <mj-text align="center" line-height="1px" font-size="14px" font-family="Helvetica Neue" color="#626262">created by</mj-text>
      <mj-text align="center" line-height="3px" font-weight="bold" font-size="20px" font-family="Helvetica Neue" color="#626262">${creator}</mj-text>
    </mj-column>
  </mj-section>
  <mj-raw>
    <!-- Icons -->
  </mj-raw>
  <mj-section background-color="#eeeeee">
    <mj-column width="170px">
      <mj-image width="72px" src="https://storage.googleapis.com/downtown65/logos/f_logo_RGB-Blue_72.png" target="https://www.facebook.com/downtown65endurance"></mj-image>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`;

  const plainText = `
    Kippis, 

    käyttäjä ${creator} loi uuden ${type}-tapahtuman ${title}.

    Tapahtuman päivämäärä: ${date}

    ${desc}

    Tarkastele tapahtumaa: ${eventUrl}
  
    Admin terveisin, 
    Kyttäki
  `;

  return {
    mjmlText,
    plainText,
  };
};

export default creationTemplate;
