import { observer } from 'mobx-react';
import { NextRouter } from 'next/router';
import Tooltip from 'rc-tooltip';
import React from 'react';
import BiospecimenTable from './BiospecimenTable';
import CaseTable from './CaseTable';
import FileTable from './FileTable';
import { DataSchemaData } from '../lib/dataSchemaHelpers';
import { groupFilesByAttrNameAndValue } from '../lib/filterHelpers';
import { Atlas, Entity, setTab } from '../lib/helpers';
import styles from './PublicationTabs.module.scss';
import { Badge } from 'react-bootstrap';

interface IPublicationTabsProps {
    router: NextRouter;
    abstract: string;
    synapseAtlas: Atlas;
    biospecimens: Entity[];
    cases: Entity[];
    assays: { [assayName: string]: Entity[] };
    schemaDataById: {
        [schemaDataId: string]: DataSchemaData;
    };
}

export enum PublicationTab {
    ABSTRACT = 'abstract',
    DATASETS = 'datasets',
    PARTICIPANTS = 'participants',
    BIOSPECIMENS = 'biospecimens',
    TOOLS = 'tools',
    SUPPORTING_LINKS = 'supporting links',
    // other tab names are autogenerated based on assay names
}

const toolsContent: { [id: string]: JSX.Element[] } = {
    duke_brca_risom_2021: [
        <>
            <h3>{`Explore Autominerva`}</h3>
            <br />
            <Tooltip overlay={`Click to Explore Autominerva`}>
                <a
                    href={
                        typeof window !== 'undefined'
                            ? `//${window.location.host}/explore?selectedFilters=%5B%7B%22value%22%3A%22mIHC%22%2C%22label%22%3A%22mIHC%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A62%2C%22isSelected%22%3Afalse%7D%2C%7B%22value%22%3A%22CyCIF%22%2C%22label%22%3A%22CyCIF%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A400%2C%22isSelected%22%3Afalse%7D%2C%7B%22value%22%3A%22MIBI%22%2C%22label%22%3A%22MIBI%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A165%2C%22isSelected%22%3Afalse%7D%2C%7B%22value%22%3A%22IMC%22%2C%22label%22%3A%22IMC%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A41%2C%22isSelected%22%3Afalse%7D%2C%7B%22value%22%3A%22H%26E%22%2C%22label%22%3A%22H%26E%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A254%2C%22isSelected%22%3Afalse%7D%2C%7B%22value%22%3A%22CyCIF%22%2C%22label%22%3A%22CyCIF%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A13%2C%22isSelected%22%3Afalse%7D%2C%7B%22group%22%3A%22AtlasName%22%2C%22value%22%3A%22HTAN+Duke%22%7D%5D&tab=file`
                            : ''
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA6_Duke_tool_example.png'}
                    />
                </a>
            </Tooltip>
        </>,
    ],
    hms_ckcm_nirmal_2022: [
        <>
            <h3>{`Explore Autominerva`}</h3>
            <br />
            <Tooltip overlay={`Click to Explore Autominerva`}>
                <a
                    href={
                        typeof window !== 'undefined'
                            ? `//${window.location.host}/explore?selectedFilters=%5B%7B%22group%22%3A%22AtlasName%22%2C%22value%22%3A%22HTAN+HMS%22%7D%2C%7B%22value%22%3A%22OME-TIFF%22%2C%22label%22%3A%22OME-TIFF%22%2C%22group%22%3A%22FileFormat%22%2C%22count%22%3A16%2C%22isSelected%22%3Afalse%7D%5D&tab=file`
                            : ''
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA6_Duke_tool_example.png'}
                    />
                </a>
            </Tooltip>
        </>,
    ],
    ohsu_brca_johnson_2022: [
        <>
            <h3>{`Explore Case HTA9_1 in cBioPortal`}</h3>
            The <a href="https://www.cbioportal.org/">cBioPortal</a> for Cancer
            Genomics is an open-source software platform that enables
            interactive, exploratory analysis of large-scale cancer genomics
            data sets with a biologist-friendly interface.
            <br />
            <Tooltip
                overlay={`Click to Explore the Clinicogenomic Profiling of Case HTA9_1 in cBioPortal`}
            >
                <a
                    href={
                        'https://www.cbioportal.org/patient?studyId=brca_hta9_htan_2022&caseId=HTA9_1'
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/cbioportal_hta9_1_patient.png'}
                    />
                </a>
            </Tooltip>
        </>,
        <>
            <h3>
                {`Explore Case HTA9_1's Liver Metastatis Biopsy in Minerva`}
            </h3>
            <a href="https://www.cycif.org/software/minerva">Minerva</a>
            is a suite of software tools for interpreting and interacting with
            complex images, organized around a guided analysis approach.
            <br />
            <Tooltip
                overlay={`Click to Explore Case HTA9_1's Breast Cancer Liver Metastatis Biopsy in Minerva`}
            >
                <a
                    href={'https://minerva-story-htan-ohsu-demo.surge.sh/'}
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/minerva_hta9_patient.png'}
                    />
                </a>
            </Tooltip>
        </>,
    ],
    msk_sclc_chan_2021: [
        <>
            <h3>{`Explore Cellxgene`}</h3>
            <a href="https://cellxgene.cziscience.com/">Cellxgene</a> is an
            interactive data explorer for single-cell datasets.
            <br />
            <Tooltip
                overlay={`Click to Explore the Celllxgene Collections Page`}
            >
                <a
                    href={
                        'https://cellxgene.cziscience.com/collections/62e8f058-9c37-48bc-9200-e767f318a8ec'
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA8_celllxgene_example.png'}
                    />
                </a>
            </Tooltip>
        </>,
    ],
    vanderbilt_crc_chen_2021: [
        <>
            <h3>{`Explore Autominerva`}</h3>
            <br />
            <Tooltip overlay={`Click to Explore Autominerva`}>
                <a
                    href={
                        typeof window !== 'undefined'
                            ? `//${window.location.host}/explore?selectedFilters=%5B%7B%22value%22%3A%22H%26E%22%2C%22label%22%3A%22H%26E%22%2C%22group%22%3A%22assayName%22%2C%22count%22%3A692%2C%22isSelected%22%3Afalse%7D%2C%7B%22group%22%3A%22AtlasName%22%2C%22value%22%3A%22HTAN+Vanderbilt%22%7D%5D&tab=file`
                            : ''
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA11_Vanderbilt_example.png'}
                    />
                </a>
            </Tooltip>
        </>,
        <>
            <h3>{`Explore in BigQuery`}</h3>
            <br />
            <Tooltip overlay={`Click to Explore BigQuery`}>
                <a
                    href={
                        typeof window !== 'undefined'
                            ? `//${window.location.host}/explore?selectedFilters=%5B%7B"value"%3A"hdf5"%2C"label"%3A"hdf5"%2C"group"%3A"FileFormat"%2C"count"%3A11%2C"isSelected"%3Afalse%7D%2C%7B"value"%3A"HTAN+Vanderbilt"%2C"label"%3A"HTAN+Vanderbilt"%2C"group"%3A"AtlasName"%2C"count"%3A4%2C"isSelected"%3Afalse%7D%5D&tab=file`
                            : ''
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA11_Vanderbilt_bigquery.png'}
                    />
                </a>
            </Tooltip>
        </>,
        <>
            <h3>
                {`Explore in cellxgene (temporarily disabled: update pending)`}
            </h3>
        </>,
    ],
    chop_all_chen_2022: [
        <>
            <h3>{`Explore Cellxgene`}</h3>
            <a href="https://cellxgene.cziscience.com/">Cellxgene</a> is an
            interactive data explorer for single-cell datasets.
            <br />
            <Tooltip
                overlay={`Click to Explore the Celllxgene Collections Page`}
            >
                <a
                    href={
                        'https://humantumoratlas.org/explore?selectedFilters=%5B%7B%22value%22%3A%22hdf5%22%2C%22label%22%3A%22hdf5%22%2C%22group%22%3A%22FileFormat%22%2C%22count%22%3A11%2C%22isSelected%22%3Afalse%7D%2C%7B%22group%22%3A%22AtlasName%22%2C%22value%22%3A%22HTAN+CHOP%22%7D%5D&tab=file'
                    }
                    target="_blank"
                >
                    <img
                        style={{ width: '60%' }}
                        src={'/HTA11_Vanderbilt_cellxgene.png'}
                    />
                </a>
            </Tooltip>
        </>,
        <>
            <h3>{`Explore in BigQuery`}</h3>
            <Tooltip overlay={`Click to Explore BigQuery`}>
                <a
                    href={
                        typeof window !== 'undefined'
                            ? `//${window.location.host}/explore?selectedFilters=%5B%7B"value"%3A"hdf5"%2C"label"%3A"hdf5"%2C"group"%3A"FileFormat"%2C"count"%3A11%2C"isSelected"%3Afalse%7D%2C%7B"group"%3A"AtlasName"%2C"value"%3A"HTAN+CHOP"%7D%5D&tab=file`
                            : ''
                    }
                    target="_blank"
                >
                    <img style={{ width: '60%' }} src={'/HTA4_bigquery.png'} />
                </a>
            </Tooltip>
        </>,
    ],
};

const supportingLinks: { [id: string]: JSX.Element[] } = {
    vanderbilt_crc_chen_2021: [
        <ul>
            <li>
                <a
                    href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE196256"
                    target="_blank"
                >
                    Mouse Mist1 and Lrig1 apc tumors (GEO: GSE196256)
                </a>
            </li>
        </ul>,
    ],
};

const PublicationTabs: React.FunctionComponent<IPublicationTabsProps> = observer(
    (props) => {
        const activeTab = props.router.query.tab || PublicationTab.ABSTRACT;
        const pubId = props.router.query?.id?.toString();

        return (
            <>
                <div className="subnav">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a
                                onClick={() =>
                                    setTab(
                                        PublicationTab.ABSTRACT,
                                        props.router
                                    )
                                }
                                className={`nav-link ${
                                    activeTab === PublicationTab.ABSTRACT
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                Abstract
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a
                                onClick={() =>
                                    setTab(
                                        PublicationTab.DATASETS,
                                        props.router
                                    )
                                }
                                className={`nav-link ${
                                    activeTab === PublicationTab.DATASETS
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                Datasets
                            </a>
                        </li> */}
                        <li className="nav-item">
                            <a
                                onClick={() =>
                                    setTab(
                                        PublicationTab.PARTICIPANTS,
                                        props.router
                                    )
                                }
                                className={`nav-link ${
                                    activeTab === PublicationTab.PARTICIPANTS
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                Participants{' '}
                                <Badge pill variant="light">
                                    {props.cases.length}
                                </Badge>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                onClick={() =>
                                    setTab(
                                        PublicationTab.BIOSPECIMENS,
                                        props.router
                                    )
                                }
                                className={`nav-link ${
                                    activeTab === PublicationTab.BIOSPECIMENS
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                Biospecimens{' '}
                                <Badge pill variant="light">
                                    {props.biospecimens.length}
                                </Badge>
                            </a>
                        </li>
                        {Object.keys(props.assays).map((assayName: string) => {
                            return (
                                <li className="nav-item">
                                    <a
                                        onClick={() =>
                                            setTab(
                                                assayName
                                                    .toLowerCase()
                                                    .replaceAll(' ', '-'),
                                                props.router
                                            )
                                        }
                                        className={`nav-link ${
                                            activeTab ===
                                            assayName
                                                .toLowerCase()
                                                .replaceAll(' ', '-')
                                                ? 'active'
                                                : ''
                                        }`}
                                    >
                                        {assayName}{' '}
                                        <Badge pill variant="light">
                                            {props.assays[assayName].length}
                                        </Badge>
                                    </a>
                                </li>
                            );
                        })}
                        {pubId && pubId in toolsContent && (
                            <li className="nav-item">
                                <a
                                    onClick={() =>
                                        setTab(
                                            PublicationTab.TOOLS,
                                            props.router
                                        )
                                    }
                                    className={`nav-link ${
                                        activeTab === PublicationTab.TOOLS
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    Tools{' '}
                                    <Badge pill variant="light">
                                        {toolsContent[pubId].length}
                                    </Badge>
                                </a>
                            </li>
                        )}
                        {pubId && pubId in supportingLinks && (
                            <li className="nav-item">
                                <a
                                    onClick={() =>
                                        setTab(
                                            PublicationTab.SUPPORTING_LINKS,
                                            props.router
                                        )
                                    }
                                    className={`nav-link ${
                                        activeTab ===
                                        PublicationTab.SUPPORTING_LINKS
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    Supporting Links
                                </a>
                            </li>
                        )}
                    </ul>
                </div>

                <div className={styles.publicationTabContent}>
                    {activeTab === PublicationTab.ABSTRACT && (
                        <div
                            className={`tab-content fileTab ${
                                activeTab !== PublicationTab.ABSTRACT
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            <p>{props.abstract}</p>
                        </div>
                    )}

                    {activeTab === PublicationTab.DATASETS && (
                        <div
                            className={`tab-content biospecimen ${
                                activeTab !== PublicationTab.DATASETS
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            {/*<label className="show-all-checkbox">
                            <input
                                type="checkbox"
                                checked={props.showAllBiospecimens}
                                onClick={props.toggleShowAllBiospecimens}
                            />
                            Show all biospecimens from filtered files
                        </label>*/}
                        </div>
                    )}

                    {activeTab === PublicationTab.PARTICIPANTS && (
                        <div
                            className={`tab-content cases ${
                                activeTab !== PublicationTab.PARTICIPANTS
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            {/*<label className="show-all-checkbox">
                            <input
                                type="checkbox"
                                checked={props.showAllCases}
                                onClick={props.toggleShowAllCases}
                            />
                            Show all cases from filtered files
                        </label>*/}
                            <CaseTable
                                synapseAtlases={[props.synapseAtlas]}
                                cases={props.cases}
                                schemaDataById={props.schemaDataById}
                                excludedColumns={[
                                    'DaystoLastFollowup',
                                    'VitalStatus',
                                ]}
                            />
                        </div>
                    )}

                    {activeTab === PublicationTab.BIOSPECIMENS && (
                        <div
                            className={`tab-content biospecimen ${
                                activeTab !== PublicationTab.BIOSPECIMENS
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            {/*<label className="show-all-checkbox">
                            <input
                                type="checkbox"
                                checked={props.showAllBiospecimens}
                                onClick={props.toggleShowAllBiospecimens}
                            />
                            Show all biospecimens from filtered files
                        </label>*/}
                            <BiospecimenTable
                                synapseAtlases={[props.synapseAtlas]}
                                samples={props.biospecimens}
                                schemaDataById={props.schemaDataById}
                            />
                        </div>
                    )}

                    {Object.keys(props.assays).map((assayName: string) => {
                        return (
                            <div
                                className={`tab-content fileTab ${
                                    activeTab !==
                                    assayName.toLowerCase().replaceAll(' ', '-')
                                        ? 'd-none'
                                        : ''
                                }`}
                            >
                                <FileTable
                                    entities={props.assays[assayName]}
                                    getGroupsByPropertyFiltered={groupFilesByAttrNameAndValue(
                                        props.assays[assayName]
                                    )}
                                    patientCount={props.cases.length}
                                    enableLevelFilter={true}
                                />
                            </div>
                        );
                    })}

                    {activeTab === PublicationTab.TOOLS && (
                        <div
                            className={`tab-content fileTab ${
                                activeTab !== PublicationTab.TOOLS
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            {props.router.query.id &&
                            props.router.query.id.toString() in toolsContent ? (
                                toolsContent[props.router.query.id.toString()]
                            ) : (
                                <div />
                            )}
                        </div>
                    )}
                    {activeTab === PublicationTab.SUPPORTING_LINKS && (
                        <div
                            className={`tab-content fileTab ${
                                activeTab !== PublicationTab.SUPPORTING_LINKS
                                    ? 'd-none'
                                    : ''
                            }`}
                        >
                            {props.router.query.id &&
                            props.router.query.id.toString() in
                                supportingLinks ? (
                                supportingLinks[
                                    props.router.query.id.toString()
                                ]
                            ) : (
                                <div />
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }
);

export default PublicationTabs;
