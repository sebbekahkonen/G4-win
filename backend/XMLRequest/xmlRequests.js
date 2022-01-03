var xmlStations = `<REQUEST> 
	<LOGIN authenticationkey='e24a39d872a2427caccb117c6f36f89c'/> 
	<QUERY objecttype='TrainStation' schemaversion='1'> 
	<FILTER> 
		<EQ name="Advertised" value="true" />
		<EQ name='CountryCode' value='SE' />
	</FILTER> 
	<INCLUDE>Prognosticated</INCLUDE> 
	<INCLUDE>AdvertisedLocationName</INCLUDE> 
	<INCLUDE>LocationSignature</INCLUDE>
	<INCLUDE>CountryCode</INCLUDE> 
	</QUERY> 
	</REQUEST>`;

	
const xmlDepartureOrArrival = function (activity, locationSignature, fromTime, toTime) { return `<REQUEST>
      <LOGIN authenticationkey="e24a39d872a2427caccb117c6f36f89c" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.3" orderby="AdvertisedTimeAtLocation">
            <FILTER>
                  <AND>
                        <EQ name="ActivityType" value="${activity}" />
                        <EQ name="LocationSignature" value="${locationSignature}" />
						<EQ name='InformationOwner' value='SJ' />
                        <OR>
                              <AND>
                                    <GT name="AdvertisedTimeAtLocation" value="$dateadd(${fromTime})" />
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(${toTime})" />
                              </AND>
                              <AND>
                                    <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />
                                    <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />
                              </AND>
                        </OR>
                  </AND>
            </FILTER>
			<INCLUDE>InformationOwner</INCLUDE>
			<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
			<INCLUDE>AdvertisedTrainIdent</INCLUDE>
			<INCLUDE>TrackAtLocation</INCLUDE>
			<INCLUDE>FromLocation</INCLUDE>
			<INCLUDE>ToLocation</INCLUDE>
			<INCLUDE>Service</INCLUDE>
			<INCLUDE>Booking</INCLUDE>
      </QUERY>
</REQUEST>`
}
	
var xmlAllDepartures = `<REQUEST>
                                <LOGIN authenticationkey='e24a39d872a2427caccb117c6f36f89c' />
                                <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1'>
                                    <FILTER>
                                    <AND>
                                        <OR>
                                            <AND>
                                                <GT name='AdvertisedTimeAtLocation' 
                                                            value='$dateadd(00:00:00)' />
                                                <LT name='AdvertisedTimeAtLocation' 
                                                            value='$dateadd(12:00:00)' />
                                            </AND>
                                            <GT name='EstimatedTimeAtLocation' value='$now' />
                                        </OR>
                                        <EQ name='ActivityType' value='Avgang' />
                                        <EQ name='InformationOwner' value='SJ' />
										</AND>
                                    </FILTER>
                                    <INCLUDE>InformationOwner</INCLUDE>
                                    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                                    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                                    <INCLUDE>TrackAtLocation</INCLUDE>
                                    <INCLUDE>FromLocation</INCLUDE>
                                    <INCLUDE>ToLocation</INCLUDE>
                                    <INCLUDE>Service</INCLUDE>
                                    <INCLUDE>Booking</INCLUDE>
                                    <INCLUDE>TrainComposition</INCLUDE>
                                </QUERY>
                                </REQUEST>`;

module.exports.xmlStations = xmlStations;
module.exports.xmlDepartureOrArrival = xmlDepartureOrArrival;
module.exports.xmlAllDepartures = xmlAllDepartures;
