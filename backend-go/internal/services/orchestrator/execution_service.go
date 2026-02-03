package orchestrator

import (
	"fmt"
	"github.com/maden/sonic-uni-agent/internal/services/orchestrator/providers"
)

type ExecutionService struct {
	lifiProvider *providers.LiFiService
}

func NewExecutionService() *ExecutionService {
	return &ExecutionService{
		lifiProvider: providers.NewLiFiService(),
	}
}

func (s *ExecutionService) ExecuteIntent(intent *UserIntent) map[string]interface{} {
	fmt.Printf("🚀 Executing Intent: %s on %s\n", intent.Action, intent.SourceChain)

	// Basit bir switch case ile işlemi yönlendir
	switch intent.Action {
	case "SWAP", "BRIDGE":
		// LI.FI Provider Kullan
		routeType, gasCost, err := s.lifiProvider.GetBestQuote(
			intent.SourceChain,
			intent.TargetChain,
			intent.TokenIn,
			intent.TokenOut,
			intent.Amount,
		)

		if err != nil {
			return map[string]interface{}{
				"status": "error",
				"error":  err.Error(),
			}
		}

		return map[string]interface{}{
			"status":    "executed",
			"route":     routeType,
			"gas_cost":  gasCost,
			"timestamp": "2024-05-20T12:00:00Z",
		}

	default:
		return map[string]interface{}{
			"status": "unknown_action",
		}
	}
}