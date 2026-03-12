import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Court from '#models/court'

/**
 * Seeds all Toronto public tennis courts from the City of Toronto
 * Parks & Recreation Facilities open dataset (WGS84 coordinates).
 *
 * Source: https://open.toronto.ca/dataset/parks-and-recreation-facilities/
 * Fetched: 2026-03-12  |  167 tennis court locations
 *
 * Courts have no court groups — they show as "no data yet" until
 * someone checks in or an admin adds court group details.
 *
 * Safe to re-run — uses updateOrCreate on slug.
 */

// Names excluded because they are handled with full detail in
// 1_priority_courts_seeder.ts (includes dataset name variants).
const EXCLUDED_NAMES = new Set([
  'RIVERDALE PARK EAST',
  'RAMSDEN PARK',
  'HIGH PARK',
  'BEACHES PARK', // same location as our priority "Kew Gardens" (2075 Queen St E)
  'CEDARVALE PARK',
  'TRINITY BELLWOODS PARK', // our priority slug is "trinity-bellwoods"
  // Christie Pits does not appear in the City dataset by that name
])

type RawCourt = { name: string; address: string; lat: number; lng: number }

/** Convert "UPPER CASE PARK NAME" → "Upper Case Park Name" */
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Generate a URL-safe slug from a park name */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Raw data from City of Toronto open data — 167 tennis court locations
const RAW: RawCourt[] = [
  {
    name: 'TRACE MANES PARK',
    address: '110 Rumsey Rd',
    lat: 43.7055701921424,
    lng: -79.3674495114294,
  },
  {
    name: 'AGINCOURT PARK',
    address: '27 Glen Watford Dr',
    lat: 43.7882598441152,
    lng: -79.2749181790006,
  },
  {
    name: 'FIRGROVE PARK',
    address: '254 Firgrove Cres',
    lat: 43.7506299180344,
    lng: -79.5215981441151,
  },
  {
    name: 'GIHON SPRING PARK',
    address: '75 Gihon Spring Dr',
    lat: 43.7545277670049,
    lng: -79.5946310987278,
  },
  { name: 'PELMO PARK', address: '171 Pellatt Ave', lat: 43.7133754999674, lng: -79.5176161188015 },
  {
    name: 'TOURNAMENT PARK',
    address: '40 Tournament Dr',
    lat: 43.7515342359626,
    lng: -79.3996976330704,
  },
  {
    name: 'WISHING WELL PARK',
    address: '1700 Pharmacy Ave',
    lat: 43.7698684464757,
    lng: -79.3166203958992,
  },
  {
    name: 'THOMSON MEMORIAL PARK',
    address: '1005 Brimley Rd',
    lat: 43.7575786212131,
    lng: -79.2533708884253,
  },
  {
    name: 'SILVER CREEK PARK',
    address: '44 Strathdee Dr',
    lat: 43.6827011188454,
    lng: -79.5434038311754,
  },
  {
    name: 'HAWKSBURY PARK',
    address: '1A Hawksbury Dr',
    lat: 43.7708575541057,
    lng: -79.3830617524566,
  },
  {
    name: 'GRAYDON HALL PARK',
    address: '215 Graydon Hall Dr',
    lat: 43.7629563031471,
    lng: -79.3420432298223,
  },
  { name: 'DUNLACE PARK', address: '28 Dunlace Dr', lat: 43.7627551760035, lng: -79.3684971094416 },
  {
    name: 'THREE VALLEYS PARK',
    address: '82 Three Valleys Dr',
    lat: 43.7505973406638,
    lng: -79.3394444920332,
  },
  {
    name: 'LEASIDE PARK',
    address: '5 Leaside Park Dr',
    lat: 43.702196292248,
    lng: -79.3500980657578,
  },
  {
    name: 'GWENDOLEN PARK',
    address: '3 Gwendolen Cres',
    lat: 43.7513187199301,
    lng: -79.4199866745491,
  },
  { name: 'HULLMAR PARK', address: '97 Hullmar Dr', lat: 43.764938632392, lng: -79.5254185601434 },
  {
    name: 'MARYVALE PARK',
    address: '5 Trestleside Grv',
    lat: 43.7530814433334,
    lng: -79.3065285038638,
  },
  {
    name: 'ALAMOSA PARK',
    address: '111 Alamosa Dr',
    lat: 43.7810883418558,
    lng: -79.3695581541507,
  },
  { name: 'HENDON PARK', address: '50 Hendon Ave', lat: 43.781475105622, lng: -79.4207514304895 },
  {
    name: 'FENSIDE PARK',
    address: '30 Slidell Cres',
    lat: 43.7648962709531,
    lng: -79.3272223149467,
  },
  {
    name: 'GRACEDALE PARK',
    address: '176 Gracedale Blvd',
    lat: 43.7519423372744,
    lng: -79.5621766506365,
  },
  { name: 'BOND PARK', address: '120 Bond Ave', lat: 43.7464153772271, lng: -79.3512498980165 },
  {
    name: 'BAYVIEW VILLAGE PARK',
    address: '2945 Bayview Ave',
    lat: 43.7730254758739,
    lng: -79.3872627358376,
  },
  {
    name: 'IRVING W. CHAPLEY PARK',
    address: '205 Wilmington Ave',
    lat: 43.7617768366639,
    lng: -79.4552215175651,
  },
  {
    name: 'BROADLANDS PARK',
    address: '19 Castlegrove Blvd',
    lat: 43.7459134838655,
    lng: -79.3212925044694,
  },
  {
    name: 'GLEN PARK',
    address: '44A Eastglen Cres',
    lat: 43.6508232826992,
    lng: -79.5528803272222,
  },
  {
    name: 'KINGSVIEW PARK',
    address: '46 Kingsview Blvd',
    lat: 43.6991667361521,
    lng: -79.5543427177554,
  },
  {
    name: 'STRATHBURN PARK',
    address: '55 Strathburn Blvd',
    lat: 43.7221408612384,
    lng: -79.5327912234411,
  },
  {
    name: 'BLOORDALE PARK SOUTH',
    address: '230 Renforth Dr',
    lat: 43.6367217859226,
    lng: -79.570250305953,
  },
  {
    name: 'WESTMOUNT PARK',
    address: '22 Arcade Dr',
    lat: 43.6873056609434,
    lng: -79.5188097180316,
  },
  {
    name: 'EAST MALL PARK',
    address: '355 The East Mall',
    lat: 43.6424081722153,
    lng: -79.5573117614495,
  },
  {
    name: 'ANCASTER PARK',
    address: '43 Ancaster Rd',
    lat: 43.7334252400042,
    lng: -79.4655052248818,
  },
  {
    name: 'CHAMPLAIN PARKETTE',
    address: '50 Champlain Blvd',
    lat: 43.732136406352,
    lng: -79.4442690567298,
  },
  {
    name: 'OURLAND PARK',
    address: '18 Ourland Ave',
    lat: 43.6155517022453,
    lng: -79.5086950991317,
  },
  { name: 'RENNIE PARK', address: '1 Rennie Ter', lat: 43.6425865328304, lng: -79.4722491877486 },
  {
    name: 'AMESBURY PARK',
    address: '151 Culford Rd',
    lat: 43.7061864960735,
    lng: -79.4834224926156,
  },
  {
    name: 'PRINCESS ANNE PARK',
    address: '25A Princess Margaret Blvd',
    lat: 43.6732653507875,
    lng: -79.5397461861723,
  },
  {
    name: 'SHAWNEE PARK',
    address: '81 Shawnee Crcl',
    lat: 43.7970431590274,
    lng: -79.3383512389528,
  },
  {
    name: 'ORIOLE PARK - NORTH YORK',
    address: '2955 Don Mills Rd W',
    lat: 43.7814908874303,
    lng: -79.3510068720322,
  },
  {
    name: 'PARK LAWN PARK',
    address: '330 Park Lawn Rd',
    lat: 43.6379464913778,
    lng: -79.4951405382046,
  },
  {
    name: 'MARYLAND PARK',
    address: '19 Maryland Blvd',
    lat: 43.691845197535,
    lng: -79.2952013420182,
  },
  {
    name: 'MCNICOLL PARK',
    address: '215 McNicoll Ave',
    lat: 43.7986097905353,
    lng: -79.3532864284025,
  },
  { name: 'MALVERN PARK', address: '36 Sewells Rd', lat: 43.8091940949041, lng: -79.2171753206629 },
  {
    name: 'SENECA HILL PARK',
    address: '620 Seneca Hill Dr',
    lat: 43.7915047394902,
    lng: -79.3517317131938,
  },
  {
    name: 'CHARLOTTETOWN PARK',
    address: '65 Charlottetown Blvd',
    lat: 43.7816672765337,
    lng: -79.140237815241,
  },
  {
    name: 'RUDDINGTON PARK',
    address: '75 Ruddington Dr',
    lat: 43.7922885533047,
    lng: -79.3892434200688,
  },
  { name: 'LANYARD PARK', address: '138 Lanyard Rd', lat: 43.74751580091, lng: -79.5486740558148 },
  {
    name: 'WEDGEWOOD PARK - NORTH YORK',
    address: '145 Wedgewood Dr',
    lat: 43.7905113052772,
    lng: -79.4063113776072,
  },
  {
    name: 'GRANDRAVINE PARK',
    address: '23 Grandravine Dr',
    lat: 43.7519255965011,
    lng: -79.4913156667407,
  },
  {
    name: 'BRIDLEWOOD PARK',
    address: '445 Huntingwood Dr',
    lat: 43.7829182576506,
    lng: -79.3162401587612,
  },
  { name: 'ROYWOOD PARK', address: '2 Roywood Dr', lat: 43.7645460317229, lng: -79.3207956490873 },
  {
    name: 'CRESTHAVEN PARK',
    address: '37 Cresthaven Dr',
    lat: 43.7989881435492,
    lng: -79.3632595733539,
  },
  { name: 'MOORE PARK', address: '110 Cactus Ave', lat: 43.7915790231191, lng: -79.4353438289312 },
  {
    name: 'GOULDING PARK',
    address: '80 Patricia Ave',
    lat: 43.7908731505349,
    lng: -79.4223942088165,
  },
  {
    name: 'BAYCREST PARK',
    address: '160 Neptune Dr',
    lat: 43.727177355758,
    lng: -79.4453131539707,
  },
  {
    name: 'IROQUOIS PARK',
    address: '295 Chartland Blvd S',
    lat: 43.803747711715,
    lng: -79.2673200754292,
  },
  {
    name: 'STEPHEN LEACOCK PARK',
    address: '2530 Birchmount Rd',
    lat: 43.7872164778617,
    lng: -79.3024857076659,
  },
  {
    name: 'LILLIAN PARK',
    address: '227 Otonabee Ave',
    lat: 43.7976883860576,
    lng: -79.4079395790164,
  },
  {
    name: 'WEST ROUGE PARK',
    address: '270 Rouge Hills Dr',
    lat: 43.7915901875863,
    lng: -79.1254637345302,
  },
  {
    name: 'ROCKFORD PARK',
    address: '70 Rockford Rd',
    lat: 43.7864470424947,
    lng: -79.4539758998359,
  },
  { name: 'CUMMER PARK', address: '823 Cummer Ave', lat: 43.7996349160363, lng: -79.3718071438594 },
  {
    name: 'MAJOR ABBAS ALI PARK',
    address: '180 McLevin Ave',
    lat: 43.8048478247522,
    lng: -79.2306931511991,
  },
  {
    name: 'CLIFFWOOD PARK',
    address: '280 Cliffwood Rd',
    lat: 43.8084161084248,
    lng: -79.3550893936359,
  },
  {
    name: 'CONFEDERATION PARK',
    address: '250 Dolly Varden Blvd',
    lat: 43.7739195595103,
    lng: -79.2361470739595,
  },
  {
    name: 'HAVENBROOK PARK',
    address: '15 Havenbrook Blvd',
    lat: 43.7677120851192,
    lng: -79.3566291501695,
  },
  {
    name: 'BELLBURY PARK',
    address: '55 Van Horne Ave',
    lat: 43.7836678749099,
    lng: -79.361302549172,
  },
  {
    name: 'MCDAIRMID WOODS PARK',
    address: '51 Rubic Cres',
    lat: 43.7798555604823,
    lng: -79.2676081437394,
  },
  {
    name: 'KIRKWOOD PARK',
    address: '25 Kirkwood Rd',
    lat: 43.7556139522765,
    lng: -79.3616754458851,
  },
  {
    name: 'BUTTONWOOD PARK',
    address: '30 Mulham Pl',
    lat: 43.6820428738713,
    lng: -79.5208937115584,
  },
  {
    name: 'YORK MILLS VALLEY PARK',
    address: '3865 Yonge St',
    lat: 43.7404834433239,
    lng: -79.4053132062419,
  },
  {
    name: 'RUNNYMEDE PARK',
    address: '221 Ryding Ave',
    lat: 43.6682913614552,
    lng: -79.4785521308344,
  },
  {
    name: 'ALBION GARDENS PARK',
    address: '41 Deanlea Crt',
    lat: 43.7396441801143,
    lng: -79.5589172142972,
  },
  {
    name: 'ROSEDALE PARK',
    address: '20 Scholfield Ave',
    lat: 43.6827794633922,
    lng: -79.3789306793129,
  },
  {
    name: 'BIRCHMOUNT PARK',
    address: '95 Birchmount Rd',
    lat: 43.6959975420342,
    lng: -79.2606666432552,
  },
  { name: 'HERON PARK', address: '292 Manse Rd', lat: 43.7692842405761, lng: -79.1772994003733 },
  {
    name: 'CLOVERDALE PARK',
    address: '85 Shaver Ave S',
    lat: 43.6338484582862,
    lng: -79.5445523626801,
  },
  {
    name: 'MANCHESTER PARK',
    address: '75 Manchester St',
    lat: 43.6199355069763,
    lng: -79.4913000316678,
  },
  {
    name: 'LAKESHORE BOULEVARD PARKLANDS',
    address: '1389 Lake Shore Blvd W',
    lat: 43.6348233594841,
    lng: -79.4426021873739,
  },
  {
    name: 'NORTH BENDALE PARK',
    address: '40 Erinlea Cres',
    lat: 43.7697082616759,
    lng: -79.2447949919631,
  },
  {
    name: 'WILLOWDALE PARK',
    address: '75 Hollywood Ave',
    lat: 43.7663856057162,
    lng: -79.4072790733353,
  },
  {
    name: 'ROYAL CREST PARK',
    address: '50 Cabernet Crcl',
    lat: 43.752791320237,
    lng: -79.6052923457683,
  },
  {
    name: 'BIRCH PARK',
    address: '75 Arcadian Crcl',
    lat: 43.5916807554031,
    lng: -79.5274185791342,
  },
  {
    name: 'GLENDORA PARK',
    address: '201 Glendora Ave',
    lat: 43.761528171259,
    lng: -79.3999245338755,
  },
  {
    name: 'INDIAN LINE PARK',
    address: '655 Humberwood Blvd',
    lat: 43.7249686519113,
    lng: -79.6224617886124,
  },
  {
    name: 'LAMBTON - KINGSWAY PARK',
    address: '37 Marquis Ave',
    lat: 43.6575825548119,
    lng: -79.5078062966722,
  },
  {
    name: 'LAWRENCE PARK RAVINE',
    address: '61 Alexander Muir Rd',
    lat: 43.7204947150046,
    lng: -79.3986040929914,
  },
  {
    name: 'MILL VALLEY PARK',
    address: '412 Mill Rd',
    lat: 43.6418045374676,
    lng: -79.5878181649625,
  },
  {
    name: 'SENTINEL PARK',
    address: '295 Sentinel Rd',
    lat: 43.7552003461125,
    lng: -79.4985517188061,
  },
  {
    name: 'CLYDESDALE PARK',
    address: '116 Clydesdale Dr',
    lat: 43.7832230867214,
    lng: -79.3294248276078,
  },
  {
    name: 'MAPLE LEAF PARK',
    address: '320 Culford Rd',
    lat: 43.7158024734685,
    lng: -79.4934534865598,
  },
  {
    name: 'QUEENSWAY PARK',
    address: '8 Avon Park Dr',
    lat: 43.6272622611483,
    lng: -79.50640370952,
  },
  {
    name: 'ELIZABETH SIMCOE PARK',
    address: '180 Sylvan Ave',
    lat: 43.739442831856,
    lng: -79.2047485283955,
  },
  {
    name: 'FOUNTAINHEAD PARK',
    address: '445 Sentinel Rd',
    lat: 43.7619604876258,
    lng: -79.4989775716806,
  },
  {
    name: 'CLAIRLEA PARK',
    address: '45 Fairfax Cres',
    lat: 43.7142966640977,
    lng: -79.2876779290248,
  },
  {
    name: 'BEAUMONDE HEIGHTS PARK',
    address: '44 Amaron Ave',
    lat: 43.7408133042436,
    lng: -79.5744937294117,
  },
  { name: 'BESTVIEW PARK', address: '115 Bestview Dr', lat: 43.8025870792, lng: -79.3836115734185 },
  {
    name: 'EARLSCOURT PARK',
    address: '1200 Lansdowne Ave',
    lat: 43.6736233946801,
    lng: -79.4515037424062,
  },
  {
    name: 'SORAUREN AVENUE PARK',
    address: '289 Sorauren Ave',
    lat: 43.6486487316384,
    lng: -79.4430674797808,
  },
  {
    name: 'LABURNHAM PARK',
    address: '60 Laburnham Ave',
    lat: 43.6001318055955,
    lng: -79.5280276819765,
  },
  {
    name: 'SEVEN OAKS PARK',
    address: '372 Military Trl',
    lat: 43.7882509492851,
    lng: -79.2105842714658,
  },
  {
    name: 'MOOREVALE PARK',
    address: '175 Moore Ave',
    lat: 43.6935039685621,
    lng: -79.3822524686726,
  },
  {
    name: 'OLD MILL SITE PARK',
    address: '5 Catherine St',
    lat: 43.6508546926695,
    lng: -79.4902386936819,
  },
  { name: 'STANLEY PARK', address: '27 Stanley Rd', lat: 43.7419026903184, lng: -79.5154063673252 },
  {
    name: 'MARTINGROVE GARDENS PARK',
    address: '31 Lavington Dr',
    lat: 43.6891656137498,
    lng: -79.563336836914,
  },
  {
    name: 'JONATHAN ASHBRIDGE PARK',
    address: '1515 Queen St E',
    lat: 43.6646987524104,
    lng: -79.3199305761713,
  },
  {
    name: 'COLEMAN PARK',
    address: '19 Coleman Ave',
    lat: 43.6893992003522,
    lng: -79.2998132896449,
  },
  {
    name: 'BENNINGTON HEIGHTS PARK',
    address: '465 Heath St E',
    lat: 43.6950046633792,
    lng: -79.3695658692435,
  },
  { name: 'NORWOOD PARK', address: '16 Norwood Rd', lat: 43.6823093441983, lng: -79.3037543039004 },
  {
    name: 'HILLCREST PARK',
    address: '950 Davenport Rd',
    lat: 43.6759841969762,
    lng: -79.4245259371429,
  },
  {
    name: 'LORA HILL PARK',
    address: '36 Fernalroy Blvd',
    lat: 43.6383335743152,
    lng: -79.5148294589457,
  },
  {
    name: 'CASSANDRA PARK',
    address: '230 Cassandra Blvd',
    lat: 43.7547695058906,
    lng: -79.3183752118466,
  },
  {
    name: 'ORIOLE PARK - TORONTO',
    address: '201 Oriole Pkwy',
    lat: 43.6972457328974,
    lng: -79.4002379577896,
  },
  {
    name: 'MICHAEL MOSTYN BALMORAL PARK',
    address: '170 Faywood Blvd',
    lat: 43.7448633231671,
    lng: -79.4498857976665,
  },
  {
    name: 'HOWARD TALBOT PARK',
    address: '635 Eglinton Ave E',
    lat: 43.7106035019732,
    lng: -79.3737533734198,
  },
  {
    name: 'TOM RILEY PARK',
    address: '4725 Dundas St W',
    lat: 43.6484570522187,
    lng: -79.5217785931657,
  },
  {
    name: 'MOSS PARK',
    address: '150 Sherbourne St',
    lat: 43.6550677751013,
    lng: -79.3710758365385,
  },
  {
    name: 'WESTGROVE PARK',
    address: '15 Redgrave Dr',
    lat: 43.6818208069823,
    lng: -79.5676612121936,
  },
  {
    name: 'BANBURY PARK',
    address: '120 Banbury Rd',
    lat: 43.7427740008615,
    lng: -79.3698734945276,
  },
  {
    name: 'SCARBORO CRESCENT PARK',
    address: '61 Undercliff Dr',
    lat: 43.7038058726171,
    lng: -79.2418181700098,
  },
  {
    name: 'SWEENEY PARK',
    address: '110 Sweeney Dr',
    lat: 43.7362132982385,
    lng: -79.3160117346005,
  },
  {
    name: 'SIR WINSTON CHURCHILL PARK',
    address: '301 St Clair Ave W',
    lat: 43.6828812987665,
    lng: -79.4088607437294,
  },
  {
    name: 'WANLESS PARK',
    address: '250 Wanless Ave',
    lat: 43.7289322010806,
    lng: -79.3920573344833,
  },
  {
    name: 'COSBURN PARK',
    address: '115 Roosevelt Rd',
    lat: 43.6929471263952,
    lng: -79.3302786222326,
  },
  {
    name: 'FAIRMOUNT PARK',
    address: '1725 Gerrard St E',
    lat: 43.6758927887358,
    lng: -79.3157246828081,
  },
  {
    name: 'WEST DEANE PARK',
    address: '19 Sedgebrook Cres',
    lat: 43.6639989620464,
    lng: -79.5634940064006,
  },
  {
    name: 'ROTARY PEACE PARK',
    address: '25 Eleventh St',
    lat: 43.5947627654434,
    lng: -79.5068692870492,
  },
  {
    name: 'CHALKFARM PARK',
    address: '2230 Jane St',
    lat: 43.7251242404364,
    lng: -79.5153050051708,
  },
  {
    name: 'SYMINGTON AVENUE PLAYGROUND',
    address: '431 Perth Ave',
    lat: 43.666706102709,
    lng: -79.4522856824199,
  },
  {
    name: 'SUNNYDALE ACRES PARK',
    address: '50 Amoro Dr',
    lat: 43.7240965975286,
    lng: -79.5785252711438,
  },
  {
    name: 'SCARLETT MILLS PARK',
    address: '235 Edenbridge Dr',
    lat: 43.6757474797456,
    lng: -79.5106471931552,
  },
  {
    name: 'WESTON LIONS PARK',
    address: '2125 Lawrence Ave W',
    lat: 43.6979437098432,
    lng: -79.5175390232004,
  },
  { name: 'WITHROW PARK', address: '725 Logan Ave', lat: 43.6744320621775, lng: -79.3469330563353 },
  {
    name: 'DOVERCOURT PARK',
    address: '155 Bartlett Ave',
    lat: 43.6652150461492,
    lng: -79.4335347095942,
  },
  {
    name: 'STANLEY GREENE PARK',
    address: '55 Stanley Greene Blvd',
    lat: 43.7344958701301,
    lng: -79.4773371188425,
  },
  {
    name: 'MIMICO MEMORIAL PARK',
    address: '75 Hillside Ave',
    lat: 43.6098135147564,
    lng: -79.4936683212394,
  },
  {
    name: 'SUMMERLEA PARK',
    address: '2 Arcot Blvd',
    lat: 43.7306176078324,
    lng: -79.5485540135118,
  },
  {
    name: 'LYTTON PARK',
    address: '200 Lytton Blvd',
    lat: 43.7149211081101,
    lng: -79.4108232778828,
  },
  {
    name: 'PRINCE OF WALES PARK',
    address: '1 Third St',
    lat: 43.5988411334612,
    lng: -79.4987828561015,
  },
  {
    name: 'ROSETHORN PARK',
    address: '26 Remington Dr',
    lat: 43.6584426494198,
    lng: -79.5391261055636,
  },
  {
    name: 'MCGREGOR PARK',
    address: '2231 Lawrence Ave E',
    lat: 43.7473020128729,
    lng: -79.2805594573923,
  },
  {
    name: 'ELIE WIESEL PARK',
    address: '30 Palm Dr',
    lat: 43.7457158547699,
    lng: -79.4380929807479,
  },
  {
    name: 'WEDGEWOOD PARK - ETOBICOKE',
    address: '15 Swan Ave',
    lat: 43.6444634725439,
    lng: -79.5475174728899,
  },
  {
    name: 'EGLINTON PARK',
    address: '200 Eglinton Ave W',
    lat: 43.707455343197,
    lng: -79.4053288312595,
  },
  {
    name: 'BOTANY HILL PARK',
    address: '277 Orton Park Rd',
    lat: 43.7781008007468,
    lng: -79.2115040419136,
  },
  { name: 'PINE POINT PARK', address: '4 Conan Rd', lat: 43.716158575835, lng: -79.5441307197754 },
  {
    name: 'HUMBER VALLEY PARK',
    address: '54 Anglesey Blvd',
    lat: 43.6648922532799,
    lng: -79.5250194488226,
  },
  {
    name: 'STANLEY PARK SOUTH - TORONTO',
    address: '700 Wellington St W',
    lat: 43.6419107696079,
    lng: -79.4089348232241,
  },
  {
    name: 'EGLINTON FLATS',
    address: '101 Emmett Ave',
    lat: 43.6849623759822,
    lng: -79.4993864277001,
  },
  {
    name: 'WESTWAY PARK',
    address: '175 The Westway',
    lat: 43.6877692742751,
    lng: -79.5415217546097,
  },
  {
    name: 'TOPHAM PARK',
    address: '181 Westview Blvd',
    lat: 43.7100225254369,
    lng: -79.3065172658871,
  },
  {
    name: 'FLAGSTAFF PARK',
    address: '42 Mercury Rd',
    lat: 43.7211741636735,
    lng: -79.5906395390043,
  },
  {
    name: 'PRAIRIE DRIVE PARK',
    address: '101 Pharmacy Ave',
    lat: 43.6971138527239,
    lng: -79.2841183857221,
  },
  {
    name: 'JEFF HEALEY PARK',
    address: '1 Delroy Dr',
    lat: 43.6302407004926,
    lng: -79.4949226189368,
  },
  {
    name: 'JUNE ROWLANDS PARK',
    address: '220 Davisville Ave',
    lat: 43.7006938928845,
    lng: -79.3885304517246,
  },
  {
    name: 'MILLWOOD PARK',
    address: '4370 Bloor St W',
    lat: 43.6317644571902,
    lng: -79.5784370133919,
  },
  {
    name: 'SIR ADAM BECK PARK',
    address: '55 Eltham Dr',
    lat: 43.6021214131556,
    lng: -79.5475491027023,
  },
  {
    name: 'SUNNYLEA PARK',
    address: '195 Prince Edward Dr S',
    lat: 43.6415571078008,
    lng: -79.5016309489152,
  },
  { name: 'NORTH PARK', address: '587 Rustic Rd', lat: 43.7164073429907, lng: -79.4739613016533 },
  {
    name: 'JIMMIE SIMPSON PARK',
    address: '870 Queen St E',
    lat: 43.6611735030376,
    lng: -79.3447424177788,
  },
  {
    name: 'ANTIBES COMMUNITY CENTRE',
    address: '140 Antibes Dr',
    lat: 43.7811383805631,
    lng: -79.4469957593676,
  },
  {
    name: 'ANGELA JAMES ARENA',
    address: '165 Grenoble Dr',
    lat: 43.7131479661019,
    lng: -79.3276349798301,
  },
]

export default class TorontoCourtsSeeder extends BaseSeeder {
  async run() {
    const courts = RAW.filter((c) => !EXCLUDED_NAMES.has(c.name))

    for (const raw of courts) {
      const name = toTitleCase(raw.name)
      const slug = slugify(name)
      await Court.updateOrCreate(
        { slug },
        {
          name,
          slug,
          address: `${raw.address}, Toronto, ON`,
          latitude: raw.lat,
          longitude: raw.lng,
          totalCourtCount: 0,
          isPriority: false,
        }
      )
    }

    console.log(
      `\nCity of Toronto courts: ${courts.length} upserted (${RAW.length - courts.length} excluded — handled as priority courts).`
    )
  }
}
