import { Head, Link } from '@inertiajs/react';
import { LegalLayout, LegalSection, LegalP, LegalList } from './layout';

export default function RGPD() {
    return (
        <>
            <Head title="RGPD & Protection des données — Fondation TITI" />
            <LegalLayout title="RGPD & Protection des données" lastUpdated="19 mai 2026">
                <LegalSection title="Notre engagement">
                    <LegalP>
                        La Fondation TITI s'engage à protéger la vie privée de ses membres et utilisateurs. Nous appliquons les principes du Règlement Général sur la Protection des Données (RGPD) européen ainsi que les dispositions de la loi camerounaise sur la cybersécurité et la cybercriminalité.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Principes fondamentaux appliqués">
                    <LegalList items={[
                        'Licéité, loyauté et transparence : vos données sont traitées légalement et de façon transparente',
                        'Limitation des finalités : vos données ne sont collectées que pour des objectifs déterminés',
                        'Minimisation des données : nous ne collectons que ce qui est strictement nécessaire',
                        'Exactitude : nous maintenons vos données à jour',
                        'Limitation de conservation : vos données ne sont pas gardées plus longtemps que nécessaire',
                        'Intégrité et confidentialité : vos données sont protégées par des mesures de sécurité adaptées',
                        'Responsabilité : nous sommes responsables du respect de ces principes',
                    ]} />
                </LegalSection>

                <LegalSection title="Responsable du traitement">
                    <LegalP>
                        Le responsable du traitement des données est la <strong>Fondation TITI</strong>, représentée par son Président, dont le siège est situé à Yaoundé, Cameroun.
                    </LegalP>
                    <LegalP>
                        Contact DPO (Délégué à la Protection des Données) : <strong>dpo@fondation-titi.org</strong>
                    </LegalP>
                </LegalSection>

                <LegalSection title="Vos droits">
                    <LegalP>
                        En tant que personne concernée, vous disposez des droits suivants que vous pouvez exercer à tout moment :
                    </LegalP>
                    <LegalList items={[
                        'Droit d\'information : être informé de l\'utilisation de vos données',
                        'Droit d\'accès : obtenir une copie de vos données',
                        'Droit de rectification : corriger des données inexactes',
                        'Droit à l\'effacement : demander la suppression de vos données',
                        'Droit à la limitation : restreindre le traitement de vos données',
                        'Droit à la portabilité : recevoir vos données dans un format structuré',
                        'Droit d\'opposition : vous opposer au traitement de vos données',
                        'Droits relatifs à la prise de décision automatisée',
                    ]} />
                </LegalSection>

                <LegalSection title="Comment exercer vos droits ?">
                    <LegalP>
                        Pour exercer vos droits, vous pouvez :
                    </LegalP>
                    <LegalList items={[
                        'Envoyer un email à : dpo@fondation-titi.org',
                        'Supprimer votre compte directement depuis vos paramètres de profil',
                        'Modifier vos préférences de communication depuis votre espace membre',
                    ]} />
                    <LegalP>
                        Nous répondrons à votre demande dans un délai maximum de 30 jours. Une pièce d'identité pourra être demandée pour vérifier votre identité.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Transferts internationaux">
                    <LegalP>
                        Vos données peuvent être transférées vers des serveurs situés en dehors du Cameroun, notamment en Europe, pour des raisons d'hébergement. Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types, décisions d'adéquation).
                    </LegalP>
                </LegalSection>

                <LegalSection title="Réclamation">
                    <LegalP>
                        Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de l'Agence Nationale des Technologies de l'Information et de la Communication (ANTIC) du Cameroun, ou auprès de la CNIL si vous êtes résident en France.
                    </LegalP>
                </LegalSection>

                <LegalSection title="Mise à jour">
                    <LegalP>
                        Cette page est mise à jour régulièrement pour refléter les évolutions de nos pratiques et de la réglementation. Consultez notre{' '}
                        <Link href="/legal/privacy" style={{ color: '#16A34A' }}>politique de confidentialité</Link>{' '}
                        pour le détail complet de nos traitements.
                    </LegalP>
                </LegalSection>
            </LegalLayout>
        </>
    );
}
