package geo

import "math"

func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371000 // Earth radius in meters
	lat1Rad := lat1 * math.Pi / 180
	lon1Rad := lon1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	lon2Rad := lon2 * math.Pi / 180

	dLat := lat2Rad - lat1Rad
	dLon := lon2Rad - lon1Rad

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}


func getNeighbors(points [][2]float64, idx int, eps float64) []int {
	neighbors := []int{}
	for i, p := range points {
		if i != idx && haversine(points[idx][0], points[idx][1], p[0], p[1]) <= eps {
			neighbors = append(neighbors, i)
		}
	}
	return neighbors
}

func Dbscan(points [][2]float64, eps float64) [][]int {
	n := len(points)

	labels := make([]int, n)
	for i := range labels {
		labels[i] = -1
	}

	clusterID := 0
	for i := 0; i < n; i++ {
		if labels[i] != -1 {
			continue
		}

		neighbors := getNeighbors(points, i, eps)

		if len(neighbors) < 1 {
			labels[i] = -1
			continue
		}

		clusterID++
		labels[i] = clusterID

		for _, neighbor := range neighbors {
			if labels[neighbor] == -1 {
				labels[neighbor] = clusterID
			}
		}
	}

	clusters := make(map[int][]int)
	for i, label := range labels {
		clusters[label] = append(clusters[label], i)
	}

	var result [][]int
	for _, ids := range clusters {
		result = append(result, ids)
	}

	return result
}
