import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_BOOTSTRAPPED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http'
import snabbdom from '@servicenow/ui-renderer-snabbdom'
import styles from './styles.scss'
import '@servicenow/now-template-card'

const view = (state) => {
	return (
		<div>
			<h2 className="title">Incidents</h2>
			<div className="card-wrapper">
				{state.result && state.result.map(item => {
					
					return (
						<now-template-card-assist tagline={{"icon": "tree-view-long-outline", "label": "Incident"}}
												  actions={[{
													  "id": "share",
													  "label": "Copy URL"
												  }, {
													  "id": "close",
													  "label": "Mark Complete"
												  }]}
												  heading={{"label": item.short_description}}
												  content={[{
													  "label": "Number",
													  "value": {"type": "string", "value": item.number}
												  }, {
													  "label": "State",
													  "value": {"type": "string", "value": item.state}
												  }, {
													  "label": "Assigment Group",
													  "value": {
														  "type": "string",
														  "value": item.assignment_group.display_value
													  }
												  }, {
													  "label": "Assigned To",
													  "value": {
														  "type": "string",
														  "value": item.assigned_to.display_value
													  }
												  }]}
												  className="card-content"
												  footerContent={{"label": "Updated", "value": item.sys_updated_on}}/>
					)
				})}
			</div>
		</div>
	)
}

createCustomElement('x-550094-incident-list', {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {dispatch} = coeffects;
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_display_value: true,
			});
		},
		'FETCH_LATEST_INCIDENT': createHttpEffect('api/now/table/incident', {
			method: 'GET',
			queryParams: ['sysparm_display_value'],
			successActionType: 'FETCH_LATEST_INCIDENT_SUCCESS'
		}),
		'FETCH_LATEST_INCIDENT_SUCCESS': (coeffects) => {
			const {action, updateState} = coeffects;
			const {result} = action.payload;
			updateState({result});
		}
	},
	renderer: {type: snabbdom},
	view,
	styles
})
