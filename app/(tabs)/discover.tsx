import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const MAX_WIDTH = Math.min(width * 0.75, 500);

const simulatedData = [
  { id: '1', name: 'Invoice #123', status: 'Approved', anomaly: false },
  { id: '2', name: 'Invoice #124', status: 'Rejected', anomaly: true },
  { id: '3', name: 'Invoice #125', status: 'Pending', anomaly: false },
  { id: '4', name: 'Invoice #126', status: 'Approved', anomaly: true },
  { id: '5', name: 'Invoice #127', status: 'Rejected', anomaly: false },
];

export default function SummaryScreen() {
  // Get light/dark mode colors from your Redux theme
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  // Search and filter state
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filteredData, setFilteredData] = useState(simulatedData);

  // Animation for the search/filter card
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [searchAnim]);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    const newData = simulatedData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(lowerSearch);
      const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    setFilteredData(newData);
  }, [searchText, filterStatus]);

  // Calculate chart data (from full data)
  const approvedCount = simulatedData.filter(item => item.status === 'Approved').length;
  const rejectedCount = simulatedData.filter(item => item.status === 'Rejected').length;
  const pendingCount = simulatedData.filter(item => item.status === 'Pending').length;

  const chartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [approvedCount, rejectedCount, pendingCount],
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
        <Text style={[styles.headerTitle, { color: colors.background.paper }]}>
          Anomaly Summary
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.background.default }]}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Invoice Overview
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.text.secondary }]}>
            Status Distribution
          </Text>
          <BarChart
            data={chartData}
            width={width - 32}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: colors.background.default,
              backgroundGradientFrom: colors.background.default,
              backgroundGradientTo: colors.background.default,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
              labelColor: (opacity = 1) => colors.text.primary,
              style: { borderRadius: 16 },
            }}
            style={styles.chartStyle}
          />
        </View>

        {/* Animated Search & Filter Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: searchAnim,
              transform: [
                {
                  translateY: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              backgroundColor: colors.background.default,
            },
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.text.primary,
                borderColor: colors.text.secondary,
              },
            ]}
            placeholder="Search Medical Invoice"
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {['All', 'Approved', 'Rejected', 'Pending'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filterStatus === status ? colors.primary.main : colors.background.default,
                    borderColor: colors.primary.main,
                  },
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: filterStatus === status ? colors.background.paper : colors.text.primary,
                    },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Data Table Card */}
        <View style={[styles.card, { backgroundColor: colors.background.default }]}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Invoice Details</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2, color: colors.text.primary }]}>Invoice</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, color: colors.text.primary }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center', color: colors.text.primary }]}>
              Anomaly
            </Text>
          </View>
          {filteredData.map(row => (
            <View key={row.id} style={styles.tableRow}>
              <Text style={[styles.tableRowText, { flex: 2, color: colors.text.primary }]}>{row.name}</Text>
              <Text style={[styles.tableRowText, { flex: 1, color: colors.text.primary }]}>{row.status}</Text>
              <Text
                style={[
                  styles.tableRowText,
                  {
                    flex: 1,
                    textAlign: 'center',
                    color: row.anomaly ? colors.error : colors.primary.main,
                  },
                ]}
              >
                {row.anomaly ? 'Yes' : 'No'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableRowText: {
    fontSize: 14,
  },
});

export default SummaryScreen;
