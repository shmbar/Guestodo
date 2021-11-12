import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
	root: {
		width: '100%',
		padding: '40px 0',
		textAlign: 'center',
	},
	sup: {
		verticalAlign: 'super',
		fontSize: 'small',
	},
});

export default function Types() {
	const classes = useStyles();

	return (
		<Container maxWidth="xl">
			<div className={classes.root}>
				<Typography
					variant="h3"
					gutterBottom
					style={{ fontFamily: '"Poppins", Sans-serif' }}
				>
					Terms of Service
				</Typography>
				<Typography
					variant="h6"
					gutterBottom
					style={{ fontFamily: '"Poppins", Sans-serif' }}
				>
					Last modified: August 17<span className={classes.sup}>th</span>, 2021
				</Typography>
			</div>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				Welcome to GuesTodo application (the "application") that is operated via the website
				www.guestodo.com (the "website"). The application and the website are operated and
				owned by GuesTodo ltd. ("GuesTodo" or "we"). by visiting the website and/or by using
				the website and/or the application and/or the services offered via the website, you
				expressly agree to and consent that you understood these Terms of use ("Terms") and
				consent to be bound by these Terms. Please read these Terms carefully before
				approving the above.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				If you do not agree to the full extent of these terms, or if you do not wish to be
				bound by these terms, please do not use the website or any of the services offered
				by the website, including the application.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				GuesTodo reserves the right to make changes in these terms, at its sole discretion,
				by publishing amended terms, and therefore, we urge you to check periodically for
				updates. Your continued use of the website or any service offered via the website,
				including the application, after the posting of updated terms, constitutes your
				agreement to such amended terms.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				The use of the masculine gender in these terms is for convenience purposes only, and
				any part thereof, in which the masculine gender is used, applies the feminine gender
				as well.
			</Typography>
			<Typography variant="body1" gutterBottom>
				In the event that you represent a corporation, then you hereby approve that you have
				the authority to bind the corporation with these terms, and to perform and provide
				all representations, warranties and obligations required on behalf of the
				corporation.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				THE APPLICATION
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				The Application is intended to provide finance services and solutions for asset
				managers and are operated via the Website.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				In order to use the Application, you shall be required to choose the type of
				subscription that you wish to purchase, and to create an account.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				As part of your use of the Application, You will have the option to upload data with
				respect to assets that will be managed by You, to the Application, and to share such
				information with the Asset owner. Please ensure that You do not upload or share any
				information in breach of our privacy policy.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				The use of the Application is for the sole purpose of asset management and not for
				any other purpose.
			</Typography>
			<Typography variant="body1" gutterBottom>
				Note that we will not be responsible for the accuracy or completeness of the data
				uploaded as part of your use of the Application or to any analysis that you will
				produce as part of your use of the Application, including in case of bugs or
				mistakes in calculations.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				YOUR ACCOUNT
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				As a condition for the use of the Application, You will be asked to open an account
				(the "Account") and to provide certain information concerning you, such as your full
				name, email, company name, cellular phone and country, as well as details of the
				assets that includes owners name, properties name, properties address, properties
				activation date and commission fee. Any information that You will disclose, shall be
				treated in accordance with our Privacy Policy.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				Upon your registration, You will also be asked to select a username and password.
				You are responsible for maintaining the confidentiality of your username and
				password, and You are fully responsible for all activities that occur under the
				Account with or without your knowledge. You agree to immediately notify Us of any
				unauthorized use of your Account or any other breach of security. We will not be
				liable for any loss or damage arising from your failure to comply with this section.
			</Typography>
			<Typography variant="body1" gutterBottom>
				GuesTodo grants You a limited, revocable non-exclusive, non-transferable, license to
				access and use the Application, the Website and the Account, all in accordance with
				these Terms and its Privacy Policy.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				You may provide permissions to other users to view the information in your Account
				as well as to upload information to your Account, by appointing them via the
				Application provided however that we shall not, in any way, be responsible to any
				transfer of any information to such users, and that such users shall also be
				obligated and approve our privacy policy, as well as that such third party shall
				maintain the username and password in strict confidence. We strongly recommend to
				avoid any transfer of any information to any third party. You shall be responsible
				for any damage cost or expense that is caused to us or to any third party by the use
				of such third party and you shall indemnify us for any claim or suit against us by
				such third party.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				The opening of an Account and the use of the Application is not available to minors
				under the age of 18. The use of the Application is not intended for minors under the
				age of 18 or to any users suspended or removed by GuesTodo from any reason, and such
				users are prohibited from using the Application and/or the Website or providing any
				information related to them.
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				You undertake that all information provided by You to GuesTodo as part of opening
				your Account, is true and accurate and consent to update this information in order
				to keep its accuracy, correctness and completeness.
			</Typography>
			<Typography variant="body1" gutterBottom>
				Logging into Your Account will enable You as follows:
			</Typography>
			<Typography variant="body1">
				a. Provide a comprehensive summary and detailed financial reports at real time
			</Typography>
			<Typography variant="body1">
				b. Automatically compute management and channel commissions
			</Typography>
			<Typography variant="body1">
				c. Provide easy access tocomprehensive accounting data
			</Typography>
			<Typography variant="body1">
				d. To consolidate business information and transactions of all of the properties
			</Typography>
			<Typography variant="body1">
				e. Record and monitor every business transaction made such as fees, payments and
				deposits
			</Typography>
			<Typography variant="body1">f. Export finance report to excel file</Typography>
			<Typography variant="body1">g. Manage access permissions to other users</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				PAYMENT
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				Any payment for subscription may be made either on a monthly subscription with
				automatic renewal, or an annual subscription.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				Following completion of any payment for services, an email will be sent to You
				summarizing the details of your order with an order number.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				You may be entitled to terminate any subscription and/or service that You ordered
				via the Website by sending a written notice by e-mail to info@guestodo.com
				indicating your name, company name and e-mail. The termination will be in effect
				upon the end of the month of subscription in case of monthly subscription or within
				7 days in case of annual subscription. In case You have ordered an annual
				subscription, You will be charged only for the time period until termination,
				provided however that the charge for the services until the date of termination will
				be made in accordance with the cost of a monthly subscription.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				You hereby represent and warrant that You are the owner of the credit card and/or
				paypal account that You are paying from, and that such credit card and/or account
				has sufficient amount of credit to cover the payment. All payments through third
				parties (such as credit card or paypal) are subject to the applicable third party's
				Terms of Service. You are aware that any inaccurate or untrue information provided
				by You with respect to such payment methods, is considered a criminal offense.
			</Typography>
			<Typography variant="body1">
				As part of your use of the service, You will define, upon each revenue or expense,
				if the revenue or expenses statements include VAT or Sales Tax or other taxes with
				respect to such asset.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				We may calculate estimated VAT or other tax payments as part of the data we provide,
				however we can not guarantee that the VAT payment / refund or Tax Payment is
				accurate and You should not rely on such calculations. You are requested to pay all
				taxes that are applicable in your country.
			</Typography>
			<Typography
				variant="body1"
				gutterBottom
				style={{ paddingBottom: '15px', fontWeight: 600 }}
			>
				Any additional service that You wish to purchase via the Website in the future,
				shall be paid via the Website in the same way as detailed herein.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				PRIVACY
			</Typography>
			<Typography variant="body1" gutterBottom style={{ paddingBottom: '15px' }}>
				Your privacy is very important to us at GuesTodo. To better protect your rights we
				have provided the GuesTodo Privacy Policy{' '}
				<Link to="/privacy">http://www.guestodo.com/privacy</Link> to explain our privacy practices
				in detail. We invite you to review our Privacy Policy, which also governs your visit
				to the Website and the use of the Application. All information we obtain about you
				in connection with your use of the Application and your visit in the Website is
				subject to our Privacy Policy.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				PERMITTED USE
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				In order to make your experience of using the Application joyful, fruitful and in
				compliance with all applicable laws, You and all other users are required not to:
			</Typography>
			<Typography variant="body1" gutterBottom>
				(i) use the Application for any illegal purpose or for any purpose other than for
				the purposes for which it is intended;
			</Typography>
			<Typography variant="body1" gutterBottom>
				(ii) sell or make commercial use in any materials contained in the Application or
				the Website, unless permitted by GuesTodo or by the user uploaded the materials;
			</Typography>
			<Typography variant="body1" gutterBottom>
				(iii) use the Application in violation of any law, contractual restrictions or other
				third party rights;
			</Typography>
			<Typography variant="body1" gutterBottom>
				(iv) intentionally interfere with or damage operation of the Application or any
				user’s enjoyment of the Application.
			</Typography>
			<Typography variant="body1" gutterBottom>
				(v) Upload, post, email, transmit or otherwise make available any content that (a)
				is defamatory, abusive, offensive, racist, obscene, pornographic, discriminatory
				unlawful, harmful, hateful, threatening, harassing, libelous, invasive of another's
				privacy, harmful to a minor or otherwise objectionable; (b) you do not own or have
				the right to disclose or make available under any law or under contractual or
				fiduciary relationships or that infringes upon confidentiality obligations, or
				proprietary rights of third parties; (c) is considered unauthorized advertising,
				such as "junk mail", "spam", "chain letters", "pyramid schemes", and any other form
				of solicitation; (d) contains software viruses, adware, spyware, worms, or other
				malicious code.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				USER CONTENT
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				You agree not to submit, transmit, or otherwise make available in any manner, any
				content (i) that is obscene, abusive, defamatory, harassing, libelous, invasive of
				another's privacy, or is otherwise objectionable, (ii) that infringes the
				intellectual property rights of any party or (iii) which contains a chain letter or
				constitutes any form of mass mailing. You may not use a false e-mail address or
				otherwise provide information that would be misleading as to the origin of such
				content. You represent and warrant that You possess all necessary rights to use the
				content that You submit to the Application and that use of such content does not
				violate these Terms. You agree to defend, indemnify, and hold GuesTodo harmless from
				and against any and all claims arising out of or relating to any content that You
				submit to the Application.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				ELECTRONIC COMMUNICATIONS
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				When You visit the Website or use the Application or send e-mails to GuesTodo, You
				are communicating with GuesTodo electronically. We therefore take this as your
				consent to receive communications from GuesTodo electronically. Please note that by
				doing so You agree that all agreements, notices, disclosures and other
				communications that GuesTodo provides You electronically satisfy any and all legal
				requirement that such communications be in writing.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				REFERENCE SITES
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				The Website and Application includes or might include links or direct connections to
				other websites, contents or resources that are owned and operated by other third
				parties as a convenience to You (“
				<span style={{ fontWeight: 600 }}>Reference Sites</span>”). Please note that
				GuesTodo does not endorse any such Reference Sites or the information, materials,
				products, or services contained on or accessible through Reference Sites. ACCESS AND
				USE OF REFERENCE SITES, INCLUDING THE INFORMATION, MATERIALS, PRODUCTS, AND SERVICES
				ON OR AVAILABLE THROUGH REFERENCE SITES IS SOLELY AT YOUR OWN RISK.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				INTELLECTUAL PROPERTY
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				All content included on the Website and/or the Application, such as text, graphics,
				logos, button icons, images, audio and/ or video clips, digital downloads, data
				compilations, page headers, scripts, and service names, including all associated
				copyrights, trademarks, brands, service marks, patents or other proprietary rights
				are the property of GuesTodo and are all protected by copyright laws and may not be
				used by You unless prior approved by GuesTodo.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px', fontWeight: 600 }}>
				You shall have the sole ownership and responsibility to all materials that You will
				upload via the Application, provided however that by uploading it, You hereby grant
				GuesTodo an irrevocable worldwide, non-exclusive, transferrable license and right to
				use, distribute, display, reproduce, and create derivative works from such content.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				GuesTodo does not regularly review any content You upload to the Application.
				GuesTodo reserves the right to edit such content in any way and to refuse to process
				any request that violates these Terms or that GuesTodo finds objectionable for any
				or no reason.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				WARRANTIES AND DISCLAIMERS
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				THE SERVICES INCLUDED IN THE WEBSITE AND THE APPLICATION , ARE PROVIDED ON AN "AS
				IS" AND "AS AVAILABLE" BASIS AND WITHOUT WARRANTIES OF ANY KIND EITHER EXPRESSED OR
				IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, GUESTODO
				HEREBY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
				INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
				A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				GUESTODO MAKES NO WARRANTY THAT (I) THE APPLICATION OR THE WEBSITE WILL MEET YOUR
				REQUIREMENTS, (II) THE WEBSITE AND THE APPLICATION WILL BE UNINTERRUPTED, TIMELY,
				SECURE, OR ERROR-FREE (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE
				WEBSITE AND THE APPLICATION WILL BE ACCURATE OR RELIABLE, (IV) THE QUALITY OF ANY
				PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL OBTAINED BY YOU THROUGH THE
				WEBSITE AND THE APPLICATION WILL MEET YOUR EXPECTATIONS.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				ANY USE OF THE WEBSITE AND THE APPLICATION AND ANY ACT YOU WILL MAKE BASED ON ANY
				ANALYSIS, DATA, CHART OR CONTENT MADE VIA THE APPLICATION IS DONE AT YOUR OWN
				DISCRETION AND RISK AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE OR LOSS CAUSED
				TO YOU WITH RESPECT THERETO.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU THROUGH THE
				WEBSITE WHETHER BY GUESTODO OR BY THIRD PARTY SHALL CREATE ANY WARRANTY TO GUESTODO
				NOT EXPRESSLY STATED IN THESE TERMS.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				GUESTODO WILL NOT BE LIABLE FOR ANY SECURITY BREAK INTO THE APPLICATION OR INTO YOUR
				ACCOUNT THAT WILL MAKE ANY DAMAGE , INCLUDING WITHOUT LIMITATIONS DATA LOST TO YOUR
				ACCOUNT.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE
				LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES.
				ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH
				JURISDICTIONS, GUESTODO'S LIABILITY WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED
				BY APPLICABLE LAW.
			</Typography>

			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				LIMITATION OF LIABILITY
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				YOU EXPRESSLY UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES GUESTODO SHALL BE
				LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY
				DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE OR
				THE INABILITY TO USE, DATA AND MATERIALS OR OTHER INTANGIBLE LOSSES (EVEN IF
				GUESTODO HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES) RELATING TO THE
				WEBSITE AND THE APPLICATION.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				IN NO EVENT SHALL GUESTODO'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND
				CAUSES OF ACTION (WHETHER IN CONTRACT, TORT (INCLUDING, BUT NOT LIMITED TO,
				NEGLIGENCE) OR OTHERWISE) EXCEED THE AMOUNT OF US$100 (ONE HUNDRED US DOLLARS), IF
				AT ALL.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				STATUTE OF LIMITATIONS
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				Regardless of any statute or law to the contrary, any claim or cause of action
				arising out of or related to use of the Website, Terms or Privacy Policy{' '}
				<Link to="/privacy">http://www.guestodo.com/privacy</Link> must be filed within not more
				than six months after such claim or cause of action arose or be forever barred.
			</Typography>
			<Typography variant="h5" gutterBottom style={{ paddingTop: '20px', fontWeight: 600 }}>
				MISCELLANEOUS
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px' }}>
				If any provision of these Terms shall be unlawful, void or unenforceable for any
				reason, the other provisions shall not be affected thereby and shall remain valid
				and enforceable to the maximum possible extent. You may not transfer or assign any
				of your rights and obligations under these Terms, and any attempt to do so will be
				null and void. These Terms together with the Website Privacy Policy, shall
				constitute the entire agreement and understanding between GuesTodo and You
				concerning the subject matter hereof and supersedes all prior agreements and
				understanding of the parties with respect thereto; The failure of GuesTodo to
				exercise or enforce any right or provision of these Terms will not constitute a
				waiver of such right or provision. Any waiver of any provision of these Terms will
				be effective only if in writing and signed by GuesTodo; These Terms and all matters
				relating to your access to, or use of, this Website shall be governed by and
				construed according to the Israeli Law, without regard to the conflict of laws
				provisions thereof.
			</Typography>
			<Typography variant="body1" style={{ paddingBottom: '15px', fontWeight: 600 }}>
				Please do not hesitate to contact our customer service at info@guestodo.com
			</Typography>
		</Container>
	);
}